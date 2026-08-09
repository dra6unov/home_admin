package bootstrap

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"home-admin.com/internal/infra/config"
)

type Server struct {
	cfg config.Config
}

func NewServer(cfg config.Config) *Server {
	return &Server{
		cfg: cfg,
	}
}

func (s *Server) Init(ctx context.Context, wg *sync.WaitGroup) {
	mux := http.NewServeMux()
	srv := &http.Server{
		Addr:         ":" + s.cfg.App.Port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	wg.Add(1)
	go func() {
		defer wg.Done()

		errChan := make(chan error, 1)
		go func() {
			errChan <- srv.ListenAndServe()
		}()

		select {
		case <-ctx.Done():
			slog.Info("Shutting down HTTP server...")
			shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

			if err := srv.Shutdown(shutdownCtx); err != nil {
				slog.Error("HTTP server shutdown error", "error", err)
			}
			cancel()
		case err := <-errChan:
			if err != nil && !errors.Is(err, http.ErrServerClosed) {
				slog.Error("HTTP server error", "error", err)
			}
		}
	}()

	slog.Info("Service serve", "port", s.cfg.App.Port)
}
