package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrCategoryEmptyTitle = errors.New("category title cannot be empty")
	ErrEmptyPassword      = errors.New("password cannot be empty")
)

type PasswordCategory struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Title     string
	Passwords []Password
}

type Password struct {
	ID         uuid.UUID
	CreatedAt  time.Time
	UpdatedAt  time.Time
	URL        *string
	Login      *string
	Password   string
	CategoryID uuid.UUID
}

type PasswordData struct {
	URL      *string
	Login    *string
	Password string
}

func NewCategory(title string, passwords []PasswordData) (*PasswordCategory, error) {
	if title == "" {
		return nil, ErrCategoryEmptyTitle
	}

	id := uuid.New()
	now := time.Now()

	c := &PasswordCategory{
		ID:        id,
		CreatedAt: now,
		UpdatedAt: now,
		Title:     title,
		Passwords: make([]Password, 0, len(passwords)),
	}

	for _, d := range passwords {
		p, err := NewPassword(id, d.URL, d.Login, d.Password)
		if err != nil {
			return nil, err
		}
		c.Passwords = append(c.Passwords, *p)
	}

	return c, nil
}

func NewPassword(categoryID uuid.UUID, url, login *string, password string) (*Password, error) {
	if password == "" {
		return nil, ErrEmptyPassword
	}

	now := time.Now()

	return &Password{
		ID:         uuid.New(),
		CreatedAt:  now,
		UpdatedAt:  now,
		URL:        url,
		Login:      login,
		Password:   password,
		CategoryID: categoryID,
	}, nil
}

func (c *PasswordCategory) AddPassword(url, login *string, password string) error {
	if password == "" {
		return ErrEmptyPassword
	}

	now := time.Now()

	newPassword := Password{
		ID:         uuid.New(),
		CreatedAt:  now,
		UpdatedAt:  now,
		URL:        url,
		Login:      login,
		Password:   password,
		CategoryID: c.ID,
	}

	c.Passwords = append(c.Passwords, newPassword)
	c.UpdatedAt = now

	return nil
}
