package httpsrv

import (
	httpadapter "github.com/MichaelSBoop/lima-backend/internal/adapters/http"
	"github.com/gorilla/mux"
)

func newRouter(h *httpadapter.Handler) *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/v1/accounts/form-consents", h.HandleCreateConsents())
	r.HandleFunc("/api/v1/accounts/aggregate", h.HandleAggregateAccounts())

	return r
}
