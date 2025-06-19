package dto

import "time"

// FolderResponse — то, что возвращаем клиенту при запросе папки
type FolderResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	ParentID  *int      `json:"parent_id,omitempty"` // null для корня
	IsCommon  bool      `json:"is_common"`           // true = общая папка, false = личная
	OwnerID   *int      `json:"owner_id,omitempty"`  // null для общих папок
	CreatedBy int       `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	CanWrite  bool      `json:"can_write"` // Новое поле: можно ли писать в папку
}

// FolderCreateRequest — структура для создания новой папки
type FolderCreateRequest struct {
	Name     string `json:"name" binding:"required"`
	ParentID *int   `json:"parent_id,omitempty"` // если nil — создаём корневую
	IsCommon bool   `json:"is_common"`           // true = в общем пространстве (либо админ создаёт личную, но обычно false)
	OwnerID  *int   `json:"owner_id,omitempty"`  // для личных папок: id пользователя
	// created_by берем из контекста (авторизованный пользователь)
}
