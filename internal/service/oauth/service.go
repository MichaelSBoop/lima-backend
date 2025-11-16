package oauth

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/MichaelSBoop/lima-backend/pkg/cache"
	"github.com/MichaelSBoop/lima-backend/pkg/httpclient"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

var (
	ErrDuplicateProvider = errors.New("duplicate providers are not allowed")
	ErrProviderNotFound  = errors.New("provider not found")
)

type Service struct {
	clientCfg map[string]clientcredentials.Config
	log       *zap.Logger
	cache     cache.Cache
}

func New(cfg Config, log *zap.Logger, cache cache.Cache) (*Service, error) {
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
		log:       log,
	}, nil
}

func (s *Service) Token(ctx context.Context, providerName string) (*oauth2.Token, error) {
	token, ok := s.cache.Get(providerName)
	if ok {
		t, ok := token.(*oauth2.Token)
		if ok {
			return t, nil
		}
	}
	providerCfg, ok := s.clientCfg[providerName]
	if !ok {
		return nil, ErrProviderNotFound
	}

	formedURL, err := formURL(providerCfg.TokenURL)
	if err != nil {
		return nil, err
	}
	q := formedURL.Query()
	q.Add("client_id", providerCfg.ClientID)
	q.Add("client_secret", providerCfg.ClientSecret)
	formedURL.RawQuery = q.Encode()

	req, err := http.NewRequest(http.MethodPost, formedURL.String(), nil)
	if err != nil {
		return nil, err
	}
	cl := httpclient.Client()

	res, err := cl.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := res.Body.Close(); err != nil {
			s.log.Error("failed to close response body", zap.Error(closeErr))
		}
	}()
	var t *oauth2.Token
	if err = json.Unmarshal(body, &t); err != nil {
		return nil, err
	}
	s.cache.SetWithExpiration(providerName, t, 86400*time.Second)
	return t, nil
}

func formURL(original string) (*url.URL, error) {
	u, err := url.Parse(original)
	if err != nil {
		return nil, err
	}
	return u, nil
}
