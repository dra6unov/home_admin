package ports

import (
	"context"
	"net/http"

	"github.com/google/uuid"
	"home-admin.com/internal/core/domain"
)

type PasswordRepository interface {
	SaveCategory(ctx context.Context, category *domain.PasswordCategory) error
	SavePasswords(ctx context.Context, passwords []domain.Password) error
	GetAll(ctx context.Context) ([]domain.PasswordCategory, error)
	DeletePassword(ctx context.Context, id uuid.UUID) error
}

type PasswordService interface {
	SaveCategory(ctx context.Context, id *uuid.UUID, title string, passwords []domain.PasswordData) (*domain.PasswordCategory, error)
	GetAll(ctx context.Context) ([]domain.PasswordCategory, error)
	DeletePassword(ctx context.Context, id uuid.UUID) error
}

type PasswordHandler interface {
	SaveCategory(w http.ResponseWriter, r *http.Request)
	GetAll(w http.ResponseWriter, r *http.Request)
	DeletePassword(w http.ResponseWriter, r *http.Request)
}

type PasswordCreateData struct {
	URL      *string
	Login    *string
	Password string
}
