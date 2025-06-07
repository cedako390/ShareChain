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
	jwtSecret string,
) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.RequestID)
	r.Use(middleware.Recoverer)

	// Публичный маршрут логина
	r.Post("/login", authHandler.Login)

	// Маршрут /me
	r.With(handler.JWTMiddleware(jwtSecret)).Get("/me", authHandler.GetMe)

	// Задачи (пример)
	r.Route("/tasks", func(r chi.Router) {
		r.Post("/create", taskHandler.CreateTask)
		r.Get("/get/{id}", taskHandler.GetTask)
	})

	// Личное пространство — все маршруты под /api/personal защищены JWT
	r.Route("/api/personal", func(r chi.Router) {
		r.Use(handler.JWTMiddleware(jwtSecret))

		// Папки
		r.Post("/folders", personalHandler.CreateFolderHandler)
		r.Get("/folders", personalHandler.ListFoldersHandler)
		r.Get("/folders/{id}", personalHandler.GetFolderHandler)
		r.Put("/folders/{id}", personalHandler.UpdateFolderHandler)
		r.Delete("/folders/{id}", personalHandler.DeleteFolderHandler)

		// Дочерние элементы (папки + файлы)
		r.Get("/folders/{id}/children", personalHandler.ListChildrenHandler)

		// Загрузка и регистрация файлов
		r.Post("/folders/{id}/files/upload-url", personalHandler.GenerateUploadURLHandler)
		r.Post("/folders/{id}/files", personalHandler.RegisterUploadedFileHandler)

		// Файлы
		r.Get("/files/{id}/download-url", personalHandler.GenerateDownloadURLHandler)
		r.Get("/files/{id}", personalHandler.GetFileMetadataHandler)
		r.Put("/files/{id}", personalHandler.UpdateFileHandler)
		r.Delete("/files/{id}", personalHandler.DeleteFileHandler)

		// Закрепы (pins)
		r.Get("/pins", personalHandler.ListPinsHandler)
		r.Post("/pins", personalHandler.AddPinHandler)
		r.Delete("/pins/{folder_id}", personalHandler.RemovePinHandler)
	})

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	return c.Handler(r)
}
