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

type Handler struct {
	accounts *accounts.Service
}

func New(params In) *Handler {
	return &Handler{
		accounts: params.Accounts,
	}
}

func (h *Handler) HandleCreateConsents() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var consents map[string]*domain.AccountConsent
		b, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err := json.Unmarshal(b, &consents); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		resConsents, err := h.accounts.CreateAccountsConsents(r.Context(), consents)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res, err := json.Marshal(resConsents)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(res)
	}
}

func (h *Handler) HandleAggregateAccounts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		clientID := r.URL.Query().Get("client_id")
		resAccounts, err := h.accounts.AggregateAccounts(r.Context(), clientID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res, err := json.Marshal(resAccounts)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(res)
	}
}
