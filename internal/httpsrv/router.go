package httpsrv

import (
	"net/http"

	httpadapter "github.com/MichaelSBoop/lima-backend/internal/adapters/http"
	"github.com/gorilla/mux"
)

func newRouter(h *httpadapter.Handler) *mux.Router {
	r := mux.NewRouter()
	apiRouter := r.NewRoute().Path("/api")
	v1 := apiRouter.Subrouter().Path("/v1")
	{
		listAccounts := v1.Subrouter().NewRoute().Path("/account-consent").Methods(http.MethodGet)
		listAccounts.HandlerFunc(h.HandleCreateConsent())
	}

	return r
}
