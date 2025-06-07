package handler

import (
	"encoding/json"
	"github.com/golang-jwt/jwt/v4"
	"goback/internal/dto"
	"goback/internal/repository"
	"net/http"
	"strings"

	"goback/internal/service"
)

// AuthHandler содержит логику HTTP-эндпоинтов, связанных с аутентификацией
type AuthHandler struct {
	authService service.AuthService
	userRepo    repository.UserRepository
	jwtSecret   string
}

// NewAuthHandler создаёт новый AuthHandler.
// Теперь мы передаём userRepo и jwtSecret дополнительно.
func NewAuthHandler(authService service.AuthService, userRepo repository.UserRepository, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		userRepo:    userRepo,
		jwtSecret:   jwtSecret,
	}
}

// LoginRequest — структура, в которую распарсим JSON тела запроса
// можно не выносить в dto, но для чистоты кода я оставлю здесь.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse — возвращаем клиенту
type LoginResponse struct {
	Token string `json:"token"`
}

// Login обрабатывает POST /login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request payload", http.StatusBadRequest)
		return
	}

	// Проверяем, что заданы обе строки
	if req.Username == "" || req.Password == "" {
		http.Error(w, "username and password must be provided", http.StatusBadRequest)
		return
	}

	// Вызываем сервис аутентификации
	token, err := h.authService.Authenticate(req.Username, req.Password)
	if err != nil {
		http.Error(w, "invalid username or password", http.StatusUnauthorized)
		return
	}

	// Успешно – возвращаем JSON с токеном
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(LoginResponse{Token: token})
}

func (h *AuthHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	// Извлекаем токен из заголовка Authorization
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
		return
	}
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		http.Error(w, "Invalid Authorization header", http.StatusUnauthorized)
		return
	}
	tokenStr := parts[1]

	// Парсим JWT
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(h.jwtSecret), nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	// Извлекаем user_id из claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}
	uidFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "user_id not found in token", http.StatusUnauthorized)
		return
	}
	userID := int(uidFloat)

	// Берём пользователя из БД по ID
	user, err := h.userRepo.GetByID(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Формируем DTO
	resp := dto.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Name:      user.Name, // если вы добавили поле Name в DTO, либо уберите
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
