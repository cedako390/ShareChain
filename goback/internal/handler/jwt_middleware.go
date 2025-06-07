package handler

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
)

// ключ в контексте для хранения user_id
type contextKey string

const userIDKey contextKey = "user_id"

// JWTMiddleware возвращает middleware, который проверяет заголовок Authorization,
// валидирует JWT и кладёт user_id в контекст.
func JWTMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
				return
			}

			tokenStr := parts[1]
			// Парсим токен
			token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
				// проверяем метод подписи
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})
			if err != nil || !token.Valid {
				http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

			// Извлекаем claims и user_id
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}

			uidFloat, ok := claims["user_id"].(float64) // из JSON числа идут float64
			if !ok {
				http.Error(w, "user_id claim missing", http.StatusUnauthorized)
				return
			}
			userID := int(uidFloat)

			// Кладём user_id в контекст
			ctx := context.WithValue(r.Context(), userIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserIDFromContext возвращает user_id из контекста. Если не найдено — возвращает 0.
func GetUserIDFromContext(ctx context.Context) int {
	if val, ok := ctx.Value(userIDKey).(int); ok {
		return val
	}
	return 0
}
