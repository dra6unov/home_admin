package password

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/google/uuid"
	"home-admin.com/internal/core/ports"
	custom_errors "home-admin.com/internal/errors"
)

// var _ ports.PasswordHandler = (*handler)(nil)

type handler struct {
	service ports.PasswordService
}

func NewHandler(service ports.PasswordService) *handler {
	return &handler{
		service: service,
	}
}

func (h *handler) SaveCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var category SaveCategoryRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		http.Error(w, "wrong json", http.StatusBadRequest)
		return
	}

	passwords := createPasswordsToDomain(category.Passwords)

	c, err := h.service.SaveCategory(ctx, category.ID, category.Title, passwords)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(c); err != nil {
		log.Printf("Ошибка кодирования JSON: %v", err)
	}
}

func (h *handler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	categories, err := h.service.GetAll(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	categoriesDTO := categoriesToDTO(categories)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(categoriesDTO); err != nil {
		log.Printf("Ошибка кодирования JSON: %v", err)
	}
}

func (h *handler) DeletePassword(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := r.PathValue("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		http.Error(w, "Wrong id format", http.StatusBadRequest)
		return
	}

	err = h.service.DeletePassword(ctx, uid)
	switch {
	case errors.Is(err, custom_errors.ErrEntityNotFound):
		http.Error(w, "Resource not found", http.StatusNotFound)
		return
	case err != nil:
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
