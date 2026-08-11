package password_repository

import (
	"time"

	"github.com/google/uuid"
	"home-admin.com/internal/core/domain"
)

type passwordDTO struct {
	ID         uuid.UUID `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	URL        *string   `json:"url"`
	Login      *string   `json:"login"`
	Password   string    `json:"password"`
	CategoryID uuid.UUID `json:"category_id"`
}

type categoryDTO struct {
	ID        uuid.UUID     `db:"id"`
	CreatedAt time.Time     `db:"created_at"`
	UpdatedAt time.Time     `db:"updated_at"`
	Title     string        `db:"title"`
	Passwords []passwordDTO `db:"passwords"`
}

func (dto categoryDTO) toDomain() domain.PasswordCategory {
	passwords := make([]domain.Password, len(dto.Passwords))
	for i, p := range dto.Passwords {
		passwords[i] = domain.Password{
			ID:         p.ID,
			CreatedAt:  p.CreatedAt,
			UpdatedAt:  p.UpdatedAt,
			URL:        p.URL,
			Login:      p.Login,
			Password:   p.Password,
			CategoryID: p.CategoryID,
		}
	}

	return domain.PasswordCategory{
		ID:        dto.ID,
		CreatedAt: dto.CreatedAt,
		UpdatedAt: dto.UpdatedAt,
		Title:     dto.Title,
		Passwords: passwords,
	}
}
