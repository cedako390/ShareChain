package dto

import "time"

// UserResponse — структура, которую мы возвращаем клиенту при GET-запросе пользователя
type UserResponse struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	Role      string    `json:"role"` // "admin" или "user"
	CreatedAt time.Time `json:"created_at"`
}
