package api

import (
	"net/http"

	"home-admin.com/internal/core/ports"
)

func RegisterRouters(mux *http.ServeMux, passwordHandler ports.PasswordHandler) {
	mux.HandleFunc("POST /password/category", passwordHandler.CreateCategory)
	mux.HandleFunc("POST /passwords", passwordHandler.CreatePasswords)
	// mux.HandleFunc("GET /passwords", passwordHandler.GetAll)
}
