package repository

import (
	"github.com/jmoiron/sqlx"
	"goback/internal/model"
	"time"
)

type FolderRepository interface {
	Create(folder *model.Folder) error
	GetByID(id int) (*model.Folder, error)
	GetFolderPath(id int) ([]model.Folder, error) // <-- НОВЫЙ МЕТОД
	ListByOwner(ownerID int, parentID *int) ([]model.Folder, error)
	ListCommon(parentID *int) ([]model.Folder, error) // <-- НОВЫЙ МЕТОД
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

// GetFolderPath возвращает путь от указанной папки до корня.
func (r *folderRepository) GetFolderPath(id int) ([]model.Folder, error) {
	var path []model.Folder
	query := `
		WITH RECURSIVE folder_path AS (
			SELECT id, name, parent_id, is_common, owner_id, created_by, created_at
			FROM folders
			WHERE id = $1
			UNION ALL
			SELECT f.id, f.name, f.parent_id, f.is_common, f.owner_id, f.created_by, f.created_at
			FROM folders f
			JOIN folder_path fp ON f.id = fp.parent_id
		)
		SELECT id, name, parent_id, is_common, owner_id, created_by, created_at FROM folder_path;
	`
	err := r.db.Select(&path, query, id)
	return path, err
}

// ListCommon возвращает список общих папок.
// Если parentID is nil - возвращает корневые.
func (r *folderRepository) ListCommon(parentID *int) ([]model.Folder, error) {
	var folders []model.Folder
	var err error
	baseQuery := `SELECT id, name, parent_id, owner_id, is_common, created_by, created_at 
	              FROM folders WHERE is_common = TRUE AND `

	if parentID == nil {
		query := baseQuery + "parent_id IS NULL"
		err = r.db.Select(&folders, query)
	} else {
		query := baseQuery + "parent_id = $1"
		err = r.db.Select(&folders, query, *parentID)
	}
	return folders, err
}
