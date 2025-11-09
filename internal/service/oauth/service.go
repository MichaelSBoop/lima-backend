package oauth

import (
	"context"
	"errors"
	"net/http"

	"github.com/MichaelSBoop/lima-backend/pkg/cache"
	"golang.org/x/oauth2/clientcredentials"
)

var (
	ErrDuplicateProvider = errors.New("duplicate providers are not allowed")
	ErrProviderNotFound  = errors.New("provider not found")
)

type Service struct {
	clientCfg map[string]clientcredentials.Config
	cache     cache.Cache
}

func New(cfg Config, cache cache.Cache) (*Service, error) {
	configMap := make(map[string]clientcredentials.Config)
	for _, provider := range cfg.OauthProviders {
		c := clientcredentials.Config{
			ClientID:     cfg.ClientID,
			ClientSecret: cfg.ClientSecret,
			TokenURL:     provider.BaseURL,
		}
		configMap[provider.Name] = c
	}
	return &Service{
		clientCfg: configMap,
		cache:     cache,
	}, nil
}

func (s *Service) ClientWithToken(ctx context.Context, providerName string) (*http.Client, error) {
	cfg, ok := s.clientCfg[providerName]
	if !ok {
		return nil, ErrProviderNotFound
	}
	return cfg.Client(ctx), nil
}
