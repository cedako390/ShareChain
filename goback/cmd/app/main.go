package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
	"goback/internal/config"
	"goback/internal/factory"
	"goback/internal/handler"
	"goback/internal/repository"
	"goback/internal/router"
	"goback/internal/service"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	log.Println("ЗАПУСК")

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

	// --- Репозитории ---
	folderRepo := repository.NewFolderRepository(db)
	fileRepo := repository.NewFileRepository(db)
	pinRepo := repository.NewPinRepository(db)
	userRepo := repository.NewUserRepository(db)
	whitelistRepo := repository.NewWhitelistRepository(db) // <-- НОВЫЙ
	taskRepo := factory.NewTaskRepository(db)

	// --- Сервисы ---
	folderSvc := service.NewFolderService(folderRepo)
	fileSvc := service.NewFileService(fileRepo, minioClient, os.Getenv("MINIO_BUCKET"))
	pinSvc := service.NewPinService(pinRepo)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)
	whitelistSvc := service.NewWhitelistService(folderRepo, whitelistRepo) // <-- НОВЫЙ
	taskSvc := factory.NewTaskService(taskRepo)

	// --- Хендлеры ---
	personalHnd := handler.NewPersonalHandler(folderSvc, fileSvc, pinSvc)
	authHnd := handler.NewAuthHandler(authSvc, userRepo, cfg.JWTSecret)
	commonHnd := handler.NewCommonHandler(folderSvc, fileSvc, whitelistSvc, userRepo) // <-- НОВЫЙ
	taskHnd := factory.NewTaskHandler(taskSvc)

	// --- Роутинг ---
	r := router.SetupRoutes(
		taskHnd,
		authHnd,
		personalHnd,
		commonHnd, // <-- НОВЫЙ
		cfg.JWTSecret,
	)

	port := cfg.Port
	if port == "" {
		port = "4000"
	}

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
