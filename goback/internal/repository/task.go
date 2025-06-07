package repository

import (
	"github.com/jmoiron/sqlx"
	"goback/internal/model"
)

// TaskRepository defines methods for task data access.
type TaskRepository interface {
	Create(task *model.Task) error
	GetByID(id int) (*model.Task, error)
}

// taskRepository implements TaskRepository.
type taskRepository struct {
	db *sqlx.DB
}

// NewTaskRepository creates a new task repository.
func NewTaskRepository(db *sqlx.DB) TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(task *model.Task) error {
	query := `INSERT INTO tasks (title, completed, created_at) VALUES (:title, :completed, :created_at) RETURNING id`
	rows, err := r.db.NamedQuery(query, task)
	if err != nil {
		return err
	}
	defer rows.Close()

	if rows.Next() {
		return rows.Scan(&task.ID)
	}
	return nil
}

func (r *taskRepository) GetByID(id int) (*model.Task, error) {
	task := &model.Task{}
	query := `SELECT id, title, completed, created_at FROM tasks WHERE id = $1`
	err := r.db.Get(task, query, id)
	if err != nil {
		return nil, err
	}
	return task, nil
}
