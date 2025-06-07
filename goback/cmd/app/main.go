package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"goback/internal/config"
	"goback/internal/factory"
	"goback/internal/handler"
	"goback/internal/repository"
	"goback/internal/router"
	"goback/internal/service"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("cannot load config: %v", err)
	}

	db, err := factory.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	minioClient := factory.NewMinioClient()

	// создаём репозитории для личного пространства
	folderRepo := repository.NewFolderRepository(db)
	fileRepo := repository.NewFileRepository(db)
	pinRepo := repository.NewPinRepository(db)

	// создаём сервисы
	folderSvc := service.NewFolderService(folderRepo)
	fileSvc := service.NewFileService(fileRepo, minioClient, os.Getenv("MINIO_BUCKET"))
	pinSvc := service.NewPinService(pinRepo)

	// создаём personal-handler
	personalHnd := handler.NewPersonalHandler(folderSvc, fileSvc, pinSvc)
	taskRepo := factory.NewTaskRepository(db)
	userRepo := repository.NewUserRepository(db)

	taskSvc := factory.NewTaskService(taskRepo)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)

	taskHnd := factory.NewTaskHandler(taskSvc)
	authHnd := handler.NewAuthHandler(authSvc, userRepo, cfg.JWTSecret)

	// Роутинг с передачей jwtSecret для middleware
	r := router.SetupRoutes(taskHnd, authHnd, personalHnd, cfg.JWTSecret)

	port := cfg.Port
	if port == "" {
		port = "4000"
	}

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
