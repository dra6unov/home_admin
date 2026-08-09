package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"home-admin.com/internal/bootstrap"
	"home-admin.com/internal/infra/config"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("Не удалось загрузить конфигурацию: %v", err)
	}
	slog.Info("config loaded", "cfg", cfg)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	dbBootstrap := bootstrap.NewPostgres(&cfg)
	pg, pgErr := dbBootstrap.Init(ctx)
	if pgErr != nil {
		log.Fatalf("Postgres initialized error: %v", pgErr)
	}
	slog.Info("Postgres initialized successfully")
	defer pg.Close()

	<-ctx.Done()
	pg.Close()
	slog.Info("Shutting down gracefully...")

	// Ждем, пока все консьюмеры доработают текущие батчи и закроют соединения
	slog.Info("All workers stopped.")
}
