package factory

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"goback/internal/config"
	"goback/internal/handler"
	"goback/internal/repository"
	"goback/internal/service"
)

// NewDatabase creates a new database connection.
func NewDatabase(cfg *config.Config) (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}

// NewTaskRepository creates a new task repository.
func NewTaskRepository(db *sqlx.DB) repository.TaskRepository {
	return repository.NewTaskRepository(db)
}

// NewTaskService creates a new task service.
func NewTaskService(repo repository.TaskRepository) service.TaskService {
	return service.NewTaskService(repo)
}

// NewTaskHandler creates a new task handler.
func NewTaskHandler(service service.TaskService) *handler.TaskHandler {
	return handler.NewTaskHandler(service)
}
