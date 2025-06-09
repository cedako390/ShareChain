package service

import (
	"goback/internal/model"
	"goback/internal/repository"
)

// WhitelistService определяет бизнес-логику для проверки прав доступа.
type WhitelistService interface {
	// CanWrite проверяет, имеет ли пользователь право на запись в указанную папку.
	CanWrite(user *model.User, folderID int) (bool, error)
}

type whitelistService struct {
	folderRepo    repository.FolderRepository
	whitelistRepo repository.WhitelistRepository
}

// NewWhitelistService создает новый WhitelistService.
func NewWhitelistService(fr repository.FolderRepository, wr repository.WhitelistRepository) WhitelistService {
	return &whitelistService{folderRepo: fr, whitelistRepo: wr}
}

// CanWrite реализует проверку прав:
// 1. Администраторы могут всё.
// 2. Пользователь может, если он есть в белом списке самой папки или любой из её родительских папок.
func (s *whitelistService) CanWrite(user *model.User, folderID int) (bool, error) {
	// Администраторы имеют полный доступ
	if user.Role == "admin" {
		return true, nil
	}

	// Получаем путь от папки до корня
	path, err := s.folderRepo.GetFolderPath(folderID)
	if err != nil {
		return false, err
	}

	// Проверяем каждую папку в пути на наличие пользователя в белом списке
	for _, folder := range path {
		ok, err := s.whitelistRepo.Check(user.ID, folder.ID)
		if err != nil {
			return false, err
		}
		if ok {
			return true, nil
		}
	}

	return false, nil
}
