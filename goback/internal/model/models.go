package model

import "time"

// User — запись из таблицы users
type User struct {
	ID           int       `db:"id"`
	Username     string    `db:"username"`
	Name         string    `db:"name"`
	PasswordHash string    `db:"password_hash"`
	Role         string    `db:"role"` // "admin" или "user"
	CreatedAt    time.Time `db:"created_at"`
}

// Folder — запись из таблицы folders
type Folder struct {
	ID        int       `db:"id"`
	Name      string    `db:"name"`
	ParentID  *int      `db:"parent_id"` // может быть NULL
	IsCommon  bool      `db:"is_common"`
	OwnerID   *int      `db:"owner_id"`   // NULL для общих, иначе ID пользователя
	CreatedBy int       `db:"created_by"` // кто создал: admin или сам юзер
	CreatedAt time.Time `db:"created_at"`
}

// FolderWhitelist — запись из таблицы folder_whitelist
type FolderWhitelist struct {
	ID       int `db:"id"`
	FolderID int `db:"folder_id"`
	UserID   int `db:"user_id"`
}

// File — запись из таблицы files
type File struct {
	ID         int       `db:"id"`
	FolderID   int       `db:"folder_id"`
	Name       string    `db:"name"`
	StorageKey string    `db:"storage_key"`
	SizeBytes  int64     `db:"size_bytes"`
	OwnerID    int       `db:"owner_id"`
	CreatedAt  time.Time `db:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"`
}
