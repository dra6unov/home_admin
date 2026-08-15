package api

import (
	"net/http"

	"home-admin.com/internal/core/ports"
)

func RegisterRouters(mux *http.ServeMux, passwordHandler ports.PasswordHandler) {
	mux.HandleFunc("POST /password/category", passwordHandler.SaveCategory)
	mux.HandleFunc("GET /passwords", passwordHandler.GetAll)
}
