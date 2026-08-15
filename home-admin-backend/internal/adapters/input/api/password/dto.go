package password

import (
	"github.com/google/uuid"
	"home-admin.com/internal/core/domain"
)

type CategoryDTO struct {
	ID        uuid.UUID  `json:"id"`
	Title     string     `json:"title"`
	Passwords []Password `json:"passwords"`
}

type Password struct {
	ID       uuid.UUID `json:"id"`
	URL      *string   `json:"url"`
	Login    *string   `json:"login"`
	Password string    `json:"password"`
}

type SaveCategoryRequestDTO struct {
	ID        *uuid.UUID                `json:"id,omitempty"`
	Title     string                    `json:"title"`
	Passwords []SavePasswordsRequestDTO `json:"passwords"`
}

type SavePasswordsRequestDTO struct {
	ID       *uuid.UUID `json:"id,omitempty"`
	URL      *string    `json:"url,omitempty"`
	Login    *string    `json:"login,omitempty"`
	Password string     `json:"password"`
}

// type SaveCategoryRequestDTO struct {
// 	ID        uuid.UUID               `json:"id"`
// 	Title     string                  `json:"title"`
// 	Passwords []PasswordCreateDataDTO `json:"passwords"`
// }

// type CreatePasswordsRequestDTO struct {
// 	CategoryID uuid.UUID               `json:"category_id"`
// 	Passwords  []PasswordCreateDataDTO `json:"passwords"`
// }

// type PasswordCreateDataDTO struct {
// 	URL      *string `json:"url,omitempty"`
// 	Login    *string `json:"login,omitempty"`
// 	Password string  `json:"password"`
// }

func categoriesToDTO(categories []domain.PasswordCategory) []CategoryDTO {
	dto := make([]CategoryDTO, len(categories))
	for i, c := range categories {
		passwords := make([]Password, len(c.Passwords))
		for j, p := range c.Passwords {
			passwords[j] = Password{
				ID:       p.ID,
				URL:      p.URL,
				Login:    p.Login,
				Password: p.Password,
			}
		}
		dto[i] = CategoryDTO{
			ID:        c.ID,
			Title:     c.Title,
			Passwords: passwords,
		}
	}
	return dto
}

func createPasswordsToDomain(passwords []SavePasswordsRequestDTO) []domain.PasswordData {
	count := len(passwords)
	passes := make([]domain.PasswordData, 0, count)

	if count == 0 {
		return passes
	}

	for _, password := range passwords {
		var id uuid.UUID
		if password.ID != nil {
			id = *password.ID
		} else {
			id = uuid.New()
		}
		passes = append(passes, domain.PasswordData{
			ID:       id,
			URL:      password.URL,
			Login:    password.Login,
			Password: password.Password,
		})
	}

	return passes
}
