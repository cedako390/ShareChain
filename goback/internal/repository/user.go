package repository

import (
	"github.com/jmoiron/sqlx"
	"goback/internal/model"
)

// UserRepository defines методы для работы с users.
type UserRepository interface {
	GetByUsername(username string) (*model.User, error)
	GetByID(id int) (*model.User, error) // <-- новый метод
}

// userRepository implements UserRepository.
type userRepository struct {
	db *sqlx.DB
}

// NewUserRepository создаёт новый UserRepository.
func NewUserRepository(db *sqlx.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetByUsername(username string) (*model.User, error) {
	user := &model.User{}
	err := r.db.Get(user, "SELECT id, username, name, password_hash, role, created_at FROM users WHERE username = $1", username)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetByID возвращает пользователя по его ID.
func (r *userRepository) GetByID(id int) (*model.User, error) {
	user := &model.User{}
	err := r.db.Get(user, "SELECT id, username, name, role, created_at FROM users WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return user, nil
}
