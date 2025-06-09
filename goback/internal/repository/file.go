package repository

import (
	"github.com/jmoiron/sqlx"
	"goback/internal/model"
	"time"
)

type FileRepository interface {
	Create(file *model.File) error
	GetByID(id int) (*model.File, error)
	ListByOwnerAndParent(ownerID int, parentID *int) ([]model.File, error)
	ListByParent(parentID *int) ([]model.File, error) // <-- НОВЫЙ МЕТОД
	UpdateMetadata(id int, newName string, newFolderID int) error
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

func (r *fileRepository) ListByOwnerAndParent(ownerID int, parentID *int) ([]model.File, error) {
	var files []model.File
	var err error
	query := `SELECT id, folder_id, name, storage_key, size_bytes, owner_id, created_at, updated_at 
	          FROM files WHERE owner_id = $1 AND `

	if parentID == nil {
		query += "folder_id IS NULL"
		err = r.db.Select(&files, query, ownerID)
	} else {
		query += "folder_id = $2"
		err = r.db.Select(&files, query, ownerID, *parentID)
	}
	return files, err
}

func (r *fileRepository) UpdateMetadata(id int, newName string, newFolderID int) error {
	_, err := r.db.Exec(`UPDATE files SET name = $1, folder_id = $2, updated_at = $3 WHERE id = $4`,
		newName, newFolderID, time.Now(), id)
	return err
}

func (r *fileRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM files WHERE id = $1`, id)
	return err
}

// ListByParent возвращает файлы из папки, не фильтруя по owner_id.
func (r *fileRepository) ListByParent(parentID *int) ([]model.File, error) {
	var files []model.File
	var err error
	query := `SELECT id, folder_id, name, storage_key, size_bytes, owner_id, created_at, updated_at
	          FROM files WHERE `
	if parentID == nil {
		query += "folder_id IS NULL"
		err = r.db.Select(&files, query)
	} else {
		query += "folder_id = $1"
		err = r.db.Select(&files, query, *parentID)
	}

	return files, err
}
