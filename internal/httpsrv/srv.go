package httpsrv

import (
	"context"
	"errors"
	"net/http"

	httpadapter "github.com/MichaelSBoop/lima-backend/internal/adapters/http"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

type Server struct {
	http.Server
	log *zap.Logger
}

func New(logger *zap.Logger, lc fx.Lifecycle, cfg Config, h *httpadapter.Handler) (*Server, error) {
	router := newRouter(h)
	srv := &Server{
		Server: http.Server{
			Addr:    cfg.Addr,
			Handler: router,
		},
		log: logger,
	}
	lc.Append(fx.StartHook(func(ctx context.Context) error {
		go func() {
			if err := srv.Server.ListenAndServe(); err != nil {
				if errors.Is(err, http.ErrServerClosed) {
					return
				}
				srv.log.Error("closing error", zap.Error(err))
			}
		}()
		return nil
	}))
	return srv, nil
}
