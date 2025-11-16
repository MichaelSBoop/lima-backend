package fx

import (
	"github.com/MichaelSBoop/lima-backend/config"
	httpadapters "github.com/MichaelSBoop/lima-backend/internal/adapters/http"
	"github.com/MichaelSBoop/lima-backend/internal/httpsrv"
	"github.com/MichaelSBoop/lima-backend/internal/infra/postgres"
	"github.com/MichaelSBoop/lima-backend/internal/service/accounts"
	"github.com/MichaelSBoop/lima-backend/internal/service/oauth"
	"github.com/MichaelSBoop/lima-backend/internal/service/requester"
	"github.com/MichaelSBoop/lima-backend/pkg/cache"
	"github.com/MichaelSBoop/lima-backend/pkg/cache/inmem"
	"github.com/MichaelSBoop/lima-backend/pkg/logger"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

func New(cfg *config.Config) fx.App {
	return *fx.New(
		fx.Supply(*cfg),
		fx.Provide(
			logger.New,
		),
		fx.Provide(
			httpadapters.New,
		),
		fx.Provide(
			accounts.New,
		),
		fx.Provide(
			fx.Annotate(
				oauth.New,
				fx.As(new(requester.TokenProvider)),
				fx.As(fx.Self()),
			),
			fx.Annotate(
				requester.New,
				fx.As(new(accounts.ConsentPoster)),
				fx.As(new(accounts.AccountsGetter)),
				fx.As(fx.Self()),
			),
		),
		fx.Provide(
			fx.Annotate(
				inmem.New,
				fx.As(new(cache.Cache)),
				fx.As(fx.Self()),
			),
		),
		fx.Provide(
			fx.Annotate(postgres.New,
				fx.As(new(accounts.ConsentSaver)),
				fx.As(new(requester.ConsentsProvider)),
				fx.As(new(accounts.AccountsSaver)),
				fx.As(fx.Self())),
		),
		fx.Provide(
			httpsrv.New,
		),
		fx.Invoke(onStart),
	)
}

func onStart(
	_ cache.Cache,
	_ *postgres.Client,
	_ *zap.Logger,
	_ *httpsrv.Server,
) {

}
