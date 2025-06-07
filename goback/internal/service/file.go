package service

import (
	"context"
	"errors"
	"fmt"
	"net/url"
	"time"

	"goback/internal/model"
	"goback/internal/repository"

	"github.com/minio/minio-go/v7"
)

type FileService interface {
	GenerateUploadURL(ctx context.Context, folderID int, filename, contentType string, size int64, ownerID int) (string, string, error)
	RegisterUploadedFile(folderID int, name, storageKey string, size int64, ownerID int) (*model.File, error)
	GenerateDownloadURL(ctx context.Context, fileID, ownerID int) (string, error)
	ListFiles(folderID, ownerID int) ([]model.File, error)
	GetFileMetadata(fileID, ownerID int) (*model.File, error)
	RenameOrMoveFile(fileID int, newName string, newFolderID, ownerID int) error
	DeleteFile(fileID, ownerID int) error
}

type fileService struct {
	repo       repository.FileRepository
	minio      *minio.Client
	bucketName string
}

func NewFileService(repo repository.FileRepository, minioClient *minio.Client, bucketName string) FileService {
	return &fileService{repo: repo, minio: minioClient, bucketName: bucketName}
}

func (s *fileService) GenerateUploadURL(ctx context.Context, folderID int, filename, contentType string, size int64, ownerID int) (string, string, error) {
	// Проверяем, что папка действительно принадлежит ownerID (здесь можно вызывать FolderService, но для простоты доверяем, что handler это проверил)
	// Генерируем уникальный ключ: personal/{ownerID}/{folderID}/{timestamp}_{filename}
	key := fmt.Sprintf("personal/%d/%d/%d_%s", ownerID, folderID, time.Now().UnixNano(), filename)
	// options
	reqParams := make(url.Values)
	reqParams.Set("Content-Type", contentType)
	// Сгенерируем presigned PUT URL
	uploadURL, err := s.minio.PresignedPutObject(ctx, s.bucketName, key, time.Minute*15)
	if err != nil {
		return "", "", err
	}
	return uploadURL.String(), key, nil
}

func (s *fileService) RegisterUploadedFile(folderID int, name, storageKey string, size int64, ownerID int) (*model.File, error) {
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

func (s *fileService) GenerateDownloadURL(ctx context.Context, fileID, ownerID int) (string, error) {
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return "", err
	}
	if f.OwnerID != ownerID {
		return "", errors.New("no access")
	}
	// Presigned GET URL на 15 минут
	downloadURL, err := s.minio.PresignedGetObject(ctx, s.bucketName, f.StorageKey, time.Minute*15, nil)
	if err != nil {
		return "", err
	}
	return downloadURL.String(), nil
}

func (s *fileService) ListFiles(folderID, ownerID int) ([]model.File, error) {
	// Проверка доступа: здесь можно доверять, что handler проверил
	return s.repo.ListByFolder(folderID)
}

func (s *fileService) GetFileMetadata(fileID, ownerID int) (*model.File, error) {
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return nil, err
	}
	if f.OwnerID != ownerID {
		return nil, errors.New("no access")
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
	// при перемещении или переименовании ключ в MinIO может остаться прежним или требовать копирования,
	// но здесь считаем, что мы не изменяем физически объект, только метаданные.
	return s.repo.UpdateMetadata(fileID, newName, newFolderID)
}

func (s *fileService) DeleteFile(fileID, ownerID int) error {
	f, err := s.repo.GetByID(fileID)
	if err != nil {
		return err
	}
	if f.OwnerID != ownerID {
		return errors.New("no access")
	}
	// Удаляем из MinIO
	err = s.minio.RemoveObject(context.Background(), s.bucketName, f.StorageKey, minio.RemoveObjectOptions{})
	if err != nil {
		return err
	}
	// Удаляем запись в БД
	return s.repo.Delete(fileID)
}
