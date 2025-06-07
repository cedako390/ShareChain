package repository

import (
	"github.com/jmoiron/sqlx"
	"goback/internal/model"
	"time"
)

type FolderRepository interface {
	Create(folder *model.Folder) error
	GetByID(id int) (*model.Folder, error)
	ListByOwner(ownerID int, parentID *int) ([]model.Folder, error)
	UpdateName(id int, newName string) error
	UpdateParent(id int, newParent *int) error
	Delete(id int) error
}

type folderRepository struct {
	db *sqlx.DB
}

func NewFolderRepository(db *sqlx.DB) FolderRepository {
	return &folderRepository{db: db}
}

func (r *folderRepository) Create(folder *model.Folder) error {
	query := `INSERT INTO folders (name, parent_id, owner_id, is_common, created_by, created_at)
	          VALUES (:name, :parent_id, :owner_id, :is_common, :created_by, :created_at) RETURNING id`
	folder.CreatedAt = time.Now()
	rows, err := r.db.NamedQuery(query, folder)
	if err != nil {
		return err
	}
	defer rows.Close()
	if rows.Next() {
		return rows.Scan(&folder.ID)
	}
	return nil
}

func (r *folderRepository) GetByID(id int) (*model.Folder, error) {
	f := &model.Folder{}
	query := `SELECT id, name, parent_id, owner_id, is_common, created_by, created_at 
	          FROM folders WHERE id = $1`
	if err := r.db.Get(f, query, id); err != nil {
		return nil, err
	}
	return f, nil
}

func (r *folderRepository) ListByOwner(ownerID int, parentID *int) ([]model.Folder, error) {
	var folders []model.Folder
	if parentID == nil {
		err := r.db.Select(&folders, `SELECT id, name, parent_id, owner_id, is_common, created_by, created_at 
		                             FROM folders 
		                             WHERE owner_id = $1 AND parent_id IS NULL`, ownerID)
		return folders, err
	}
	err := r.db.Select(&folders, `SELECT id, name, parent_id, owner_id, is_common, created_by, created_at 
	                             FROM folders 
	                             WHERE owner_id = $1 AND parent_id = $2`, ownerID, *parentID)
	return folders, err
}

func (r *folderRepository) UpdateName(id int, newName string) error {
	_, err := r.db.Exec(`UPDATE folders SET name = $1 WHERE id = $2`, newName, id)
	return err
}

func (r *folderRepository) UpdateParent(id int, newParent *int) error {
	_, err := r.db.Exec(`UPDATE folders SET parent_id = $1 WHERE id = $2`, newParent, id)
	return err
}

func (r *folderRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM folders WHERE id = $1`, id)
	return err
}
