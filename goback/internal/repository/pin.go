package repository

import (
	"github.com/jmoiron/sqlx"
)

type PinRepository interface {
	ListByUser(userID int) ([]int, error) // возвращает slice of folder_id
	Create(userID, folderID int) error
	Delete(userID, folderID int) error
}

type pinRepository struct {
	db *sqlx.DB
}

func NewPinRepository(db *sqlx.DB) PinRepository {
	return &pinRepository{db: db}
}

func (r *pinRepository) ListByUser(userID int) ([]int, error) {
	var folderIDs []int
	err := r.db.Select(&folderIDs, `SELECT folder_id FROM pinned_folders WHERE user_id = $1`, userID)
	return folderIDs, err
}

func (r *pinRepository) Create(userID, folderID int) error {
	_, err := r.db.Exec(`INSERT INTO pinned_folders (user_id, folder_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
		userID, folderID)
	return err
}

func (r *pinRepository) Delete(userID, folderID int) error {
	_, err := r.db.Exec(`DELETE FROM pinned_folders WHERE user_id = $1 AND folder_id = $2`, userID, folderID)
	return err
}
