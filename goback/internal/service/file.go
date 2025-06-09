package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/url"
	"time"

	"goback/internal/model"
	"goback/internal/repository"

	"github.com/minio/minio-go/v7"
)

type FileService interface {
	GenerateUploadURL(ctx context.Context, folderID *int, filename, contentType string, size int64, ownerID int) (string, string, error)
	RegisterUploadedFile(folderID *int, name, storageKey string, size int64, ownerID int) (*model.File, error)
	GenerateDownloadURL(ctx context.Context, fileID, ownerID int) (string, error)
	ListFiles(ownerID int, parentID *int) ([]model.File, error)
	GetFileMetadata(fileID, ownerID int) (*model.File, error)
	RenameOrMoveFile(fileID int, newName string, newFolderID, ownerID int) error
	DeleteFile(fileID, ownerID int) error

	ListCommonFiles(parentID *int) ([]model.File, error)
}

type fileService struct {
	repo       repository.FileRepository
	minio      *minio.Client
	bucketName string
}

func NewFileService(repo repository.FileRepository, minioClient *minio.Client, bucketName string) FileService {
	return &fileService{repo: repo, minio: minioClient, bucketName: bucketName}
}

func (s *fileService) ListCommonFiles(parentID *int) ([]model.File, error) {
	return s.repo.ListByParent(parentID)
}

func (s *fileService) GenerateUploadURL(ctx context.Context, folderID *int, filename, contentType string, size int64, ownerID int) (string, string, error) {
	var folderIDPath string
	if folderID != nil {
		folderIDPath = fmt.Sprintf("%d", *folderID)
	} else {
		folderIDPath = "root"
	}

	key := fmt.Sprintf("personal/%d/%s/%d_%s", ownerID, folderIDPath, time.Now().UnixNano(), filename)
	reqParams := make(url.Values)
	reqParams.Set("Content-Type", contentType)
	uploadURL, err := s.minio.PresignedPutObject(ctx, s.bucketName, key, time.Minute*15)
	if err != nil {
		return "", "", err
	}
	return uploadURL.String(), key, nil
}

func (s *fileService) RegisterUploadedFile(folderID *int, name, storageKey string, size int64, ownerID int) (*model.File, error) {
	f := &model.File{
		FolderID:   folderID,
		Name:       name,
		StorageKey: storageKey,
		SizeBytes:  size,
		OwnerID:    ownerID,
	}
	if err := s.repo.Create(f); err != nil {
		return nil, err
	}
	return f, nil
}

func (s *fileService) GenerateDownloadURL(ctx context.Context, fileID int, userID int) (string, error) {
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return "", err
	}
	// Для личных файлов проверяем владельца, для общих - нет
	if f.OwnerID != 0 && f.OwnerID != userID {
		return "", errors.New("forbidden")
	}

	return "s.minio.PresignedGetObject(ctx, s.bucketName, f.StorageKey, 15*time.Minute, nil)", nil
}

func (s *fileService) ListFiles(ownerID int, parentID *int) ([]model.File, error) {
	return s.repo.ListByOwnerAndParent(ownerID, parentID)
}

func (s *fileService) GetFileMetadata(fileID int, userID int) (*model.File, error) {
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return nil, err
	}
	if f.OwnerID != 0 && f.OwnerID != userID {
		return nil, errors.New("forbidden")
	}
	return f, nil
}

func (s *fileService) RenameOrMoveFile(fileID int, newName string, newFolderID, ownerID int) error {
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return err
	}
	if f.OwnerID != ownerID {
		return errors.New("no access")
	}
	return s.repo.UpdateMetadata(fileID, newName, newFolderID)
}

func (s *fileService) DeleteFile(fileID int, userID int) error {
	// В сервисе мы больше не проверяем права, это делает хендлер через WhitelistService
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return err
	}

	// Удаляем объект из MinIO
	err = s.minio.RemoveObject(context.Background(), s.bucketName, f.StorageKey, minio.RemoveObjectOptions{})
	if err != nil {
		// Логируем ошибку, но не блокируем удаление из БД
		log.Printf("WARN: could not delete object %s from minio: %v", f.StorageKey, err)
	}

	// Удаляем запись из БД
	return s.repo.Delete(fileID)
}
