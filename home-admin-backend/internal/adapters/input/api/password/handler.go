package password

import (
	"encoding/json"
	"log"
	"net/http"

	"home-admin.com/internal/core/ports"
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

func (h *handler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var category CreateCategoryRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		http.Error(w, "wrong json", http.StatusBadRequest)
		return
	}

	passwords := createPasswordsToDomain(category.Passwords)

	c, err := h.service.CreateCategory(ctx, category.Title, passwords)
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

func (h *handler) CreatePasswords(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req CreatePasswordsRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "wrong json", http.StatusBadRequest)
		return
	}

	passwordData := make([]ports.PasswordCreateData, len(req.Passwords))
	for i, p := range req.Passwords {
		passwordData[i] = ports.PasswordCreateData{
			URL:      p.URL,
			Login:    p.Login,
			Password: p.Password,
		}
	}

	passwords, err := h.service.CreatePasswords(ctx, req.CategoryID.String(), passwordData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(passwords); err != nil {
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
