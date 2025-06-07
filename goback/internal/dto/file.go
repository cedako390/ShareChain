package dto

import "time"

// FileResponse — возвращаем клиенту метаданные по файлу
type FileResponse struct {
	ID         int       `json:"id"`
	FolderID   int       `json:"folder_id"`
	Name       string    `json:"name"`
	StorageKey string    `json:"storage_key"`
	SizeBytes  int64     `json:"size_bytes"`
	OwnerID    int       `json:"owner_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// FileUploadRequest — запрос для загрузки нового файла
type FileUploadRequest struct {
	FolderID int    `json:"folder_id" binding:"required"`
	Name     string `json:"name" binding:"required"`
	// само содержимое файла обычно берётся из form-data, но ключ minio формируем на сервере
	// поле StorageKey не приходит от клиента — сервер генерирует
}
