package main

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"home-admin.com/internal/bootstrap"
	"home-admin.com/internal/infra/config"

	_ "github.com/jackc/pgx/v5/stdlib"
)

//go:embed migrations/*.sql
var migrationFiles embed.FS

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("Не удалось загрузить конфигурацию: %v", err)
	}
	slog.Info("config loaded", "cfg", cfg)

	runMigrations(cfg)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Инициализируем и запускаем Postgres
	dbBootstrap := bootstrap.NewPostgres(&cfg)
	pg, pgErr := dbBootstrap.Init(ctx)
	if pgErr != nil {
		log.Fatalf("Postgres initialized error: %v", pgErr)
	}
	slog.Info("Postgres initialized successfully")
	defer pg.Close()

	var wg sync.WaitGroup
	// Запускаем http-сервер
	server := bootstrap.NewServer(cfg)
	server.Init(ctx, &wg)

	// Слушаем сигнал к завершению для закрытия
	<-ctx.Done()
	pg.Close()
	slog.Info("Shutting down gracefully...")
}

func runMigrations(cfg config.Config) {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.Postgres.User, cfg.Postgres.Password, cfg.Postgres.Host, cfg.Postgres.Port, cfg.Postgres.Name)
	slog.Info("Run migrations...")

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Error opening connection for migrations: %v", err)
	}
	defer db.Close()

	sourceDriver, err := iofs.New(migrationFiles, "migrations")
	if err != nil {
		log.Fatalf("Error loading migration files: %v", err)
	}

	dbDriver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatalf("Error creating DB driver for migrate: %v", err)
	}

	m, err := migrate.NewWithInstance("iofs", sourceDriver, "postgres", dbDriver)
	if err != nil {
		log.Fatalf("Error initializing migrate: %v", err)
	}

	if err = m.Up(); err != nil {
		// ErrNoChange is not an error, it means the DB is already up to date
		if err == migrate.ErrNoChange {
			slog.Info("Migrations not required (database is already up to date)")
			return
		}
		log.Fatalf("Error running migrations: %v", err)
	}

	slog.Info("Migrations applied successfully!")
}
