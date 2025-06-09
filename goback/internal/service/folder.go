package service

import (
	"errors"
	"goback/internal/model"
	"goback/internal/repository"
)

type FolderService interface {
	CreatePersonalFolder(name string, parentID *int, ownerID int) (*model.Folder, error)
	ListPersonalFolders(ownerID int, parentID *int) ([]model.Folder, error)
	GetPersonalFolder(id, ownerID int) (*model.Folder, error)
	RenameFolder(id int, newName string, ownerID int) error
	MoveFolder(id int, newParent *int, ownerID int) error
	DeleteFolder(id, ownerID int) error

	// --- Новые методы для common ---
	ListCommonFolders(parentID *int) ([]model.Folder, error)
	CreateCommonFolder(name string, parentID *int, creatorID int) (*model.Folder, error)
	RenameCommonFolder(id int, newName string) error
	DeleteCommonFolder(id int) error
}

type folderService struct {
	repo repository.FolderRepository
}

func NewFolderService(r repository.FolderRepository) FolderService {
	return &folderService{repo: r}
}

func (s *folderService) ListCommonFolders(parentID *int) ([]model.Folder, error) {
	return s.repo.ListCommon(parentID)
}

func (s *folderService) CreateCommonFolder(name string, parentID *int, creatorID int) (*model.Folder, error) {
	f := &model.Folder{
		Name:      name,
		ParentID:  parentID,
		IsCommon:  true,
		OwnerID:   nil, // У общих папок нет владельца
		CreatedBy: creatorID,
	}
	err := s.repo.Create(f)
	return f, err
}

func (s *folderService) RenameCommonFolder(id int, newName string) error {
	// Здесь не нужна проверка владельца, права проверяются в хендлере
	return s.repo.UpdateName(id, newName)
}

func (s *folderService) DeleteCommonFolder(id int) error {
	// Аналогично, права проверяются в хендлере
	return s.repo.Delete(id)
}

func (s *folderService) CreatePersonalFolder(name string, parentID *int, ownerID int) (*model.Folder, error) {
	// при создании личной папки is_common = false
	f := &model.Folder{
		Name:      name,
		ParentID:  parentID,
		OwnerID:   &ownerID,
		IsCommon:  false,
		CreatedBy: ownerID,
	}
	if err := s.repo.Create(f); err != nil {
		return nil, err
	}
	return f, nil
}

func (s *folderService) ListPersonalFolders(ownerID int, parentID *int) ([]model.Folder, error) {
	return s.repo.ListByOwner(ownerID, parentID)
}

func (s *folderService) GetPersonalFolder(id, ownerID int) (*model.Folder, error) {
	f, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	// проверяем, что папка принадлежит ownerID и is_common = false
	if f.OwnerID == nil || *f.OwnerID != ownerID || f.IsCommon {
		return nil, errors.New("not found or no access")
	}
	return f, nil
}

func (s *folderService) RenameFolder(id int, newName string, ownerID int) error {
	f, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if f.OwnerID == nil || *f.OwnerID != ownerID {
		return errors.New("no access")
	}
	return s.repo.UpdateName(id, newName)
}

func (s *folderService) MoveFolder(id int, newParent *int, ownerID int) error {
	f, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if f.OwnerID == nil || *f.OwnerID != ownerID {
		return errors.New("no access")
	}
	// при перемещении нужно убедиться, что новый parent тоже принадлежит owner
	if newParent != nil {
		parent, err2 := s.repo.GetByID(*newParent)
		if err2 != nil {
			return err2
		}
		if parent.OwnerID == nil || *parent.OwnerID != ownerID {
			return errors.New("no access to parent")
		}
	}
	return s.repo.UpdateParent(id, newParent)
}

func (s *folderService) DeleteFolder(id, ownerID int) error {
	f, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if f.OwnerID == nil || *f.OwnerID != ownerID {
		return errors.New("no access")
	}
	return s.repo.Delete(id)
}
