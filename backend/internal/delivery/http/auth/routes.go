package http

import "github.com/gofiber/fiber/v2"

func RegisterRoutes(app *fiber.App, handlers *Handler) {
	api := app.Group("/auth")
	api.Post("/login", handlers.Login)
}
