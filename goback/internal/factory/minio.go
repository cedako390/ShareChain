package factory

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// NewMinioClient создаёт и возвращает *minio.Client, используя переменные окружения:
//
//	MINIO_ENDPOINT, MINIO_ACCESS, MINIO_SECRET, MINIO_SECURE (false/true)
func NewMinioClient() *minio.Client {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS")
	secretKey := os.Getenv("MINIO_SECRET")
	secureEnv := os.Getenv("MINIO_SECURE")

	// по умолчанию считаем, что соединение небезопасное, если не задано иначе
	secure := false
	if secureEnv != "" {
		parsed, err := strconv.ParseBool(secureEnv)
		if err != nil {
			log.Printf("warning: неверное значение MINIO_SECURE=%q, используем false", secureEnv)
		} else {
			secure = parsed
		}
	}
	fmt.Println(secure)
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: secure,
	})
	if err != nil {
		log.Fatalf("не удалось создать minio-клиент: %v", err)
	}

	return minioClient
}
