package repository

import (
	"github.com/jmoiron/sqlx"
	"goback/internal/model"
	"time"
)

type FileRepository interface {
	Create(file *model.File) error
	GetByID(id int) (*model.File, error)
	ListByFolder(folderID int) ([]model.File, error)
	UpdateMetadata(id int, newName string, newFolder int) error
	Delete(id int) error
}

type fileRepository struct {
	db *sqlx.DB
}

func NewFileRepository(db *sqlx.DB) FileRepository {
	return &fileRepository{db: db}
}

func (r *fileRepository) Create(file *model.File) error {
	file.CreatedAt = time.Now()
	file.UpdatedAt = time.Now()
	query := `INSERT INTO files (folder_id, name, storage_key, size_bytes, owner_id, created_at, updated_at)
	          VALUES (:folder_id, :name, :storage_key, :size_bytes, :owner_id, :created_at, :updated_at)
	          RETURNING id`
	rows, err := r.db.NamedQuery(query, file)
	if err != nil {
		return err
	}
	defer rows.Close()
	if rows.Next() {
		return rows.Scan(&file.ID)
	}
	return nil
}

func (r *fileRepository) GetByID(id int) (*model.File, error) {
	f := &model.File{}
	query := `SELECT id, folder_id, name, storage_key, size_bytes, owner_id, created_at, updated_at 
	          FROM files WHERE id = $1`
	if err := r.db.Get(f, query, id); err != nil {
		return nil, err
	}
	return f, nil
}

func (r *fileRepository) ListByFolder(folderID int) ([]model.File, error) {
	var files []model.File
	err := r.db.Select(&files, `SELECT id, folder_id, name, storage_key, size_bytes, owner_id, created_at, updated_at 
	                            FROM files WHERE folder_id = $1`, folderID)
	return files, err
}

func (r *fileRepository) UpdateMetadata(id int, newName string, newFolder int) error {
	_, err := r.db.Exec(`UPDATE files SET name = $1, folder_id = $2, updated_at = $3 WHERE id = $4`,
		newName, newFolder, time.Now(), id)
	return err
}

func (r *fileRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM files WHERE id = $1`, id)
	return err
}
