package config

import (
	"os"
)

// Config holds application configuration.
type Config struct {
	DatabaseURL string
	Port        string
	JWTSecret   string
}

// LoadConfig loads configuration from environment variables.
func LoadConfig() (*Config, error) {
	return &Config{
		DatabaseURL: os.Getenv("DATABASE_URL"),
		Port:        os.Getenv("PORT"),
		JWTSecret:   os.Getenv("JWT_SECRET"), // обязательно задать JWT_SECRET в окружении
	}, nil
}
