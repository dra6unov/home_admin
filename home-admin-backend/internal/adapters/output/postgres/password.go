package postgres

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"home-admin.com/internal/core/domain"
)

type PasswordRepository struct {
	db *pgxpool.Pool
}

func NewPasswordRepository(db *pgxpool.Pool) *PasswordRepository {
	return &PasswordRepository{
		db: db,
	}
}

func (r *PasswordRepository) CreateCategory(ctx context.Context, category *domain.PasswordCategory) error {
	if category == nil {
		return fmt.Errorf("category data is empty")
	}

	query := `
		INSERT INTO password_categories (id, created_at, updated_at, title) VALUES ($1, $2, $3, $4)
	`

	if _, err := r.db.Exec(ctx, query, category.ID, category.CreatedAt, category.UpdatedAt, category.Title); err != nil {
		return fmt.Errorf("unable to insert row: %w", err)
	}

	if err := r.CreatePasswords(ctx, category.Passwords); err != nil {
		return fmt.Errorf("error while creating passwords with categoty: %w", err)
	}

	return nil
}

func (r *PasswordRepository) CreatePasswords(ctx context.Context, passwords []domain.Password) error {
	if len(passwords) == 0 {
		return fmt.Errorf("passwords list is empty")
	}

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("unable to begin transaction: %w", err)
	}

	defer func() {
		_ = tx.Rollback(ctx)
	}()

	query := `
		INSERT INTO passwords (id, created_at, updated_at, url, login, password, category_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	for _, p := range passwords {
		_, err := tx.Exec(ctx, query, p.ID, p.CreatedAt, p.UpdatedAt, p.URL, p.Login, p.Password, p.CategoryID)
		if err != nil {
			return fmt.Errorf("unable to insert password row: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("unable to commit transaction: %w", err)
	}

	return nil
}

// func (r *PasswordRepository) GetAll(ctx context.Context) ([]domain.PasswordCategory, error) {
// 	query := `
// 	SELECT pc.id, pc.created_at, pc.updated_at, p.id, p.created_at, p.updated_at, pc.title, p.url, p.login, p.password
// FROM password_categories pc
//          LEFT JOIN public.passwords p ON pc.id = p.category_id
// ORDER BY pc.created_at DESC
// 	`

// 	return nil, nil
// }
