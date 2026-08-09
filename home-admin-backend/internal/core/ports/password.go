package ports

import (
	"context"
	"net/http"

	"home-admin.com/internal/core/domain"
)

type PasswordRepository interface {
	CreateCategory(ctx context.Context, category *domain.PasswordCategory) error
	CreatePasswords(ctx context.Context, passwords []domain.Password) error
	// GetAll(ctx context.Context) ([]domain.PasswordCategory, error)
}

type PasswordService interface {
	CreateCategory(ctx context.Context, title string, passwords []domain.PasswordData) (*domain.PasswordCategory, error)
	CreatePasswords(ctx context.Context, categoryID string, passwords []PasswordCreateData) ([]domain.Password, error)
	// GetAll(ctx context.Context) ([]domain.PasswordCategory, error)
}

type PasswordHandler interface {
	CreateCategory(w http.ResponseWriter, r *http.Request)
	CreatePasswords(w http.ResponseWriter, r *http.Request)
	// GetAll(w http.ResponseWriter, r *http.Request)
}

type PasswordCreateData struct {
	URL      *string
	Login    *string
	Password string
}
