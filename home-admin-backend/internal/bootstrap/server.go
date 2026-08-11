package bootstrap

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"github.com/rs/cors"
	"home-admin.com/internal/adapters/input/api"
	"home-admin.com/internal/core/ports"
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

func (s *Server) Init(ctx context.Context, wg *sync.WaitGroup, passHandler ports.PasswordHandler) {
	mux := http.NewServeMux()
	api.RegisterRouters(mux, passHandler)

	handler := applyCORS(mux)

	srv := &http.Server{
		Addr:         ":" + s.cfg.App.Port,
		Handler:      handler,
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

func applyCORS(next http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	return c.Handler(next)
}
