package http

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/MichaelSBoop/lima-backend/internal/domain"
	"github.com/MichaelSBoop/lima-backend/internal/service/accounts"
	"go.uber.org/fx"
)

type In struct {
	fx.In

	Accounts *accounts.Service
}

func New(params In) *Handler {
	return &Handler{
		accounts: *params.Accounts,
	}
}

func (h *Handler) HandleCreateConsent() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var consent domain.AccountConsent
		b, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err := json.Unmarshal(b, &consent); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		consentID, err := h.accounts.CreateAccountsConsent(r.Context(), consent.Permissions, consent.ClientID, consent.RequestingBank, consent.Reason)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(consentID)
	}
}

type Handler struct {
	accounts accounts.Service
}
