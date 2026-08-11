package password

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"home-admin.com/internal/core/domain"
	"home-admin.com/internal/core/ports"
)

type service struct {
	passwordRepo ports.PasswordRepository
}

func NewService(passwordRepo ports.PasswordRepository) *service {
	return &service{
		passwordRepo: passwordRepo,
	}
}

func (s *service) CreateCategory(ctx context.Context, title string, passwords []domain.PasswordData) (*domain.PasswordCategory, error) {
	c, err := domain.NewCategory(title, passwords)
	if err != nil {
		return nil, fmt.Errorf("password service: %w", err)
	}

	if err := s.passwordRepo.CreateCategory(ctx, c); err != nil {
		return nil, err
	}

	return c, nil
}

func (s *service) CreatePasswords(ctx context.Context, categoryID string, passwords []ports.PasswordCreateData) ([]domain.Password, error) {
	catID, err := uuid.Parse(categoryID)
	if err != nil {
		return nil, fmt.Errorf("password service: invalid category ID: %w", err)
	}

	if len(passwords) == 0 {
		return nil, fmt.Errorf("password service: passwords list is empty")
	}

	domainPasswords := make([]domain.Password, 0, len(passwords))
	for _, p := range passwords {
		domainP, err := domain.NewPassword(catID, p.URL, p.Login, p.Password)
		if err != nil {
			return nil, fmt.Errorf("password service: %w", err)
		}
		domainPasswords = append(domainPasswords, *domainP)
	}

	if err := s.passwordRepo.CreatePasswords(ctx, domainPasswords); err != nil {
		return nil, err
	}

	return domainPasswords, nil
}

func (s *service) GetAll(ctx context.Context) ([]domain.PasswordCategory, error) {
	return s.passwordRepo.GetAll(ctx)
}
