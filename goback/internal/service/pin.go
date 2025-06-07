package service

import (
	"goback/internal/repository"
)

type PinService interface {
	ListPins(userID int) ([]int, error)
	AddPin(userID, folderID int) error
	RemovePin(userID, folderID int) error
}

type pinService struct {
	repo repository.PinRepository
}

func NewPinService(repo repository.PinRepository) PinService {
	return &pinService{repo: repo}
}

func (s *pinService) ListPins(userID int) ([]int, error) {
	return s.repo.ListByUser(userID)
}

func (s *pinService) AddPin(userID, folderID int) error {
	return s.repo.Create(userID, folderID)
}

func (s *pinService) RemovePin(userID, folderID int) error {
	return s.repo.Delete(userID, folderID)
}
