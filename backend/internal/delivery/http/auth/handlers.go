package http

import "github.com/gofiber/fiber/v2"

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) Login(c *fiber.Ctx) error {

	return c.JSON(fiber.Map{
		"success": true,
	})
}
