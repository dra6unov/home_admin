package bootstrap

import (
	"context"
	"strconv"

	"home-admin.com/internal/infra/config"
	"home-admin.com/internal/infra/postgres"
)

type Postgres struct {
	Config *config.Config
}

func NewPostgres(config *config.Config) *Postgres {
	return &Postgres{
		Config: config,
	}
}

func (db *Postgres) Init(ctx context.Context) (*postgres.Postgres, error) {
	maxConn, maxErr := strconv.Atoi(db.Config.Postgres.MaxConns)
	if maxErr != nil {
		maxConn = 20
	}

	minConn, minErr := strconv.Atoi(db.Config.Postgres.MinConns)
	if minErr != nil {
		minConn = 2
	}

	return postgres.NewPostgres(ctx, postgres.Config{
		Host:     db.Config.Postgres.Host,
		Port:     db.Config.Postgres.Port,
		Name:     db.Config.Postgres.Name,
		Password: db.Config.Postgres.Password,
		User:     db.Config.Postgres.User,
		MaxConns: maxConn,
		MinConns: minConn,
		// MaxConnIdleTime: 15 * time.Minute,
		// MaxConnLifetime: 1 * time.Hour,
		ConnTimeout: db.Config.Postgres.ConnTimeout,
	})
}
