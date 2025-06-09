package repository

import (
	"github.com/jmoiron/sqlx"
)

// WhitelistRepository определяет методы для работы с белым списком папок.
type WhitelistRepository interface {
	// Check проверяет, находится ли пользователь в белом списке для указанной папки.
	Check(userID, folderID int) (bool, error)
}

type whitelistRepository struct {
	db *sqlx.DB
}

// NewWhitelistRepository создает новый WhitelistRepository.
func NewWhitelistRepository(db *sqlx.DB) WhitelistRepository {
	return &whitelistRepository{db: db}
}

func (r *whitelistRepository) Check(userID, folderID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM folder_whitelist WHERE user_id = $1 AND folder_id = $2)`
	err := r.db.Get(&exists, query, userID, folderID)
	return exists, err
}
