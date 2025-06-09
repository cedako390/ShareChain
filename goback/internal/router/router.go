package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
	"goback/internal/handler"
)

// SetupRoutes конфигурирует все маршруты
func SetupRoutes(
	taskHandler *handler.TaskHandler,
	authHandler *handler.AuthHandler,
	personalHandler *handler.PersonalHandler,
	commonHandler *handler.CommonHandler,
	jwtSecret string,
) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.RequestID)
	r.Use(middleware.Recoverer)

	r.Post("/login", authHandler.Login)
	r.With(handler.JWTMiddleware(jwtSecret)).Get("/me", authHandler.GetMe)

	r.Route("/tasks", func(r chi.Router) {
		r.Post("/create", taskHandler.CreateTask)
		r.Get("/get/{id}", taskHandler.GetTask)
	})

	r.Route("/api/personal", func(r chi.Router) {
		r.Use(handler.JWTMiddleware(jwtSecret))

		// Папки
		r.Post("/folders", personalHandler.CreateFolderHandler)
		r.Get("/folders", personalHandler.ListFoldersHandler)
		r.Get("/folders/{id}", personalHandler.GetFolderHandler)
		r.Put("/folders/{id}", personalHandler.UpdateFolderHandler)
		r.Delete("/folders/{id}", personalHandler.DeleteFolderHandler)

		// --- NEW FILE ROUTES ---
		// Загрузка и регистрация файлов
		r.Post("/files/upload-url", personalHandler.GenerateUploadURLHandler)
		r.Post("/files", personalHandler.RegisterUploadedFileHandler)

		// Файлы (метаданные и скачивание)
		r.Get("/files/{id}/download-url", personalHandler.GenerateDownloadURLHandler)
		r.Get("/files/{id}", personalHandler.GetFileMetadataHandler)
		r.Put("/files/{id}", personalHandler.UpdateFileHandler)
		r.Delete("/files/{id}", personalHandler.DeleteFileHandler)

		// Закрепы (pins)
		r.Get("/pins", personalHandler.ListPinsHandler)
		r.Post("/pins", personalHandler.AddPinHandler)
		r.Delete("/pins/{folder_id}", personalHandler.RemovePinHandler)
	})

	r.Route("/api/common", func(r chi.Router) {
		r.Use(handler.JWTMiddleware(jwtSecret))

		// Папки
		r.Get("/folders", commonHandler.ListRootFoldersHandler)            // Список корневых папок
		r.Get("/folders/{id}/children", commonHandler.ListChildrenHandler) // Содержимое папки
		r.Post("/folders", commonHandler.CreateFolderHandler)              // Создать подпапку
		r.Put("/folders/{id}", commonHandler.UpdateFolderHandler)          // Переименовать
		r.Delete("/folders/{id}", commonHandler.DeleteFolderHandler)       // Удалить

		// Файлы
		r.Get("/files/{id}/download-url", commonHandler.GenerateDownloadURLHandler)      // URL для скачивания (всем)
		r.Post("/folders/{id}/files/upload-url", commonHandler.GenerateUploadURLHandler) // URL для загрузки (с правами)
		r.Post("/folders/{id}/files", commonHandler.RegisterUploadedFileHandler)         // Регистрация файла (с правами)
		r.Put("/files/{id}", commonHandler.UpdateFileHandler)                            // Переименовать файл (с правами)
		r.Delete("/files/{id}", commonHandler.DeleteFileHandler)                         // Удалить файл (с правами)
	})

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	return c.Handler(r)
}
