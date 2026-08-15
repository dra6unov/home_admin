package api

import (
	"net/http"

	"home-admin.com/internal/core/ports"
)

func RegisterRouters(mux *http.ServeMux, passwordHandler ports.PasswordHandler) {
	mux.HandleFunc("POST /passwords/save", passwordHandler.SaveCategory)
	mux.HandleFunc("GET /passwords", passwordHandler.GetAll)
	mux.HandleFunc("DELETE /passwords/{id}", passwordHandler.DeletePassword)
}
