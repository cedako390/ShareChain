package dto

// WhitelistEntryResponse — возвращаем клиенту, кто имеет право записи в папку
type WhitelistEntryResponse struct {
	FolderID int `json:"folder_id"`
	UserID   int `json:"user_id"`
}

// WhitelistAddRequest — запрос, чтобы добавить пользователя в белый список папки
type WhitelistAddRequest struct {
	FolderID int `json:"folder_id" binding:"required"`
	UserID   int `json:"user_id" binding:"required"`
}
