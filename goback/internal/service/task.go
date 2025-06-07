package service

import (
	"goback/internal/model"
	"goback/internal/repository"
	"time"
)

// TaskService defines methods for task business logic.
type TaskService interface {
	CreateTask(title string) (*model.Task, error)
	GetTask(id int) (*model.Task, error)
}

// taskService implements TaskService.
type taskService struct {
	repo repository.TaskRepository
}

// NewTaskService creates a new task service.
func NewTaskService(repo repository.TaskRepository) TaskService {
	return &taskService{repo: repo}
}

func (s *taskService) CreateTask(title string) (*model.Task, error) {
	task := &model.Task{
		Title:     title,
		Completed: false,
		CreatedAt: time.Now(),
	}
	if err := s.repo.Create(task); err != nil {
		return nil, err
	}
	return task, nil
}

func (s *taskService) GetTask(id int) (*model.Task, error) {
	return s.repo.GetByID(id)
}
