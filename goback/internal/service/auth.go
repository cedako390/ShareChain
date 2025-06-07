package service

import (
	"errors"
	"time"

	"goback/internal/repository"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// AuthService определяет метод для аутентификации и выдачи токена.
type AuthService interface {
	// Authenticate проверяет username/password и возвращает JWT или ошибку.
	Authenticate(username, plainPassword string) (string, error)
}

// authService implements AuthService.
type authService struct {
	userRepo  repository.UserRepository
	jwtSecret string
}

// NewAuthService создаёт новый AuthService.
//
//	userRepo-хранилище, jwtSecret – секрет для подписи токена.
func NewAuthService(userRepo repository.UserRepository, jwtSecret string) AuthService {
	return &authService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

// Authenticate если username найден и пароль совпадает, возвращаем signed JWT.
func (s *authService) Authenticate(username, plainPassword string) (string, error) {
	// 1. Берём пользователя из БД
	user, err := s.userRepo.GetByUsername(username)
	if err != nil {
		// обычно sqlx возвращает sql.ErrNoRows, но мы просто возвращаем общую ошибку
		return "", errors.New("invalid username or password")
	}

	// 2. Сравниваем bcrypt-хеш с заданным plainPassword
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(plainPassword)); err != nil {
		return "", errors.New("invalid username or password")
	}

	// 3. Генерируем JWT
	//    Добавим в claims: user_id и role
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // срок действия 24 часа
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
