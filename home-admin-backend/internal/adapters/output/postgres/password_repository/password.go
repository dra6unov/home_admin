package password_repository

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/jackc/pgx/v5"
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

func (r *PasswordRepository) SaveCategory(ctx context.Context, category *domain.PasswordCategory) error {
	if category == nil {
		return fmt.Errorf("category data is empty")
	}

	query := `
		INSERT INTO password_categories (id, created_at, updated_at, title)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (id)
			DO UPDATE SET 
				updated_at = EXCLUDED.updated_at,
				title = EXCLUDED.title;
	`

	if _, err := r.db.Exec(ctx, query, category.ID, category.CreatedAt, category.UpdatedAt, category.Title); err != nil {
		return fmt.Errorf("unable to insert row: %w", err)
	}

	if err := r.SavePasswords(ctx, category.Passwords); err != nil {
		return fmt.Errorf("error while creating passwords with categoty: %w", err)
	}

	return nil
}

func (r *PasswordRepository) SavePasswords(ctx context.Context, passwords []domain.Password) error {
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
		ON CONFLICT (id)
			DO UPDATE SET 
				updated_at = EXCLUDED.updated_at,
				url = EXCLUDED.url,
				login = EXCLUDED.login,
				password = EXCLUDED.password,
				category_id = EXCLUDED.category_id;
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

func (r *PasswordRepository) GetAll(ctx context.Context) ([]domain.PasswordCategory, error) {
	query := `
		SELECT 
			pc.id, pc.created_at, pc.updated_at, pc.title,
			COALESCE(jsonb_agg(to_jsonb(p)) FILTER (WHERE p.id IS NOT NULL), '[]'::jsonb) AS passwords
		FROM password_categories pc
		LEFT JOIN passwords p ON p.category_id = pc.id
		GROUP BY pc.id, pc.created_at, pc.updated_at, pc.title
		ORDER BY pc.created_at DESC;
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}

	categories, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (domain.PasswordCategory, error) {
		categoryRow, err := pgx.RowToStructByName[categoryDTO](row)
		if err != nil {
			return domain.PasswordCategory{}, err
		}
		return categoryRow.toDomain(), nil
	})
	if err != nil {
		slog.ErrorContext(ctx, "get all query", "error", err)
		return nil, err
	}

	return categories, nil
}
