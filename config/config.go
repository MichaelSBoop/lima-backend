package config

import (
	"github.com/MichaelSBoop/lima-backend/internal/httpsrv"
	pg "github.com/MichaelSBoop/lima-backend/internal/infra/postgres"
	"github.com/MichaelSBoop/lima-backend/internal/service/oauth"
	"github.com/MichaelSBoop/lima-backend/pkg/cache/inmem"
	"github.com/MichaelSBoop/lima-backend/pkg/logger"
	"go.uber.org/fx"
)

type Config struct {
	fx.Out

	HTTP     httpsrv.Config `json:"http" yaml:"http"`
	Log      logger.Config  `json:"log" yaml:"log"`
	Postgres pg.Config      `json:"postgres" yaml:"postgres"`
	Oauth    oauth.Config   `json:"oauth" yaml:"oauth"`
	Cache    inmem.Config   `json:"cache" yaml:"cache"`
}
