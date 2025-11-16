package requester

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/MichaelSBoop/lima-backend/internal/domain"
	"github.com/MichaelSBoop/lima-backend/pkg/httpclient"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

type Service struct {
	log              *zap.Logger
	token            TokenProvider
	consentsProvider ConsentsProvider
}

func New(log *zap.Logger, token TokenProvider, consentsProvider ConsentsProvider) *Service {
	return &Service{
		log:              log,
		token:            token,
		consentsProvider: consentsProvider,
	}
}

func (s *Service) PostConsent(ctx context.Context, consent domain.AccountConsent, providerName string) (*domain.AccountConsent, error) {
	token, err := s.token.Token(ctx, providerName)
	if err != nil {
		return nil, err
	}
	body := struct {
		ClientID           string   `json:"client_id" yaml:"client_id"`
		Permissions        []string `json:"permissions" yaml:"permissions"`
		Reason             string   `json:"reason" yaml:"reason"`
		RequestingBank     string   `json:"requesting_bank" yaml:"requesting_bank"`
		RequestingBankName string   `json:"requesting_bank_name" yaml:"requesting_bank_name"`
	}{
		ClientID:           consent.ClientID,
		Permissions:        consent.Permissions,
		Reason:             consent.Reason,
		RequestingBank:     consent.RequestingBank,
		RequestingBankName: consent.RequestingBankName,
	}
	data, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	destURL := url.URL{
		Scheme: "https",
		Host:   providerName + ".open.bankingapi.ru",
		Path:   "/account-consents/request",
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, destURL.String(), bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	headers := &http.Header{}
	headers.Add("Authorization", "Bearer "+token.AccessToken)
	headers.Add("X-Requesting-Bank", consent.RequestingBank)
	req.Header = *headers
	cl := httpclient.Client()
	s.log.Debug("making request to app", zap.String("provider", providerName))
	resp, err := cl.Do(req)
	if err != nil {
		return nil, err
	}
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := resp.Body.Close(); err != nil {
			s.log.Error("failed to close response body", zap.Error(closeErr))
		}
	}()

	var respData struct {
		Status       string `json:"status" yaml:"status"`
		ConsentID    string `json:"consent_id" yaml:"consent_id"`
		AutoApproved bool   `json:"auto_approved" yaml:"auto_approved"`
	}
	if err := json.Unmarshal(bodyBytes, &respData); err != nil {
		return nil, err
	}
	consent.Status = respData.Status
	consent.ConsentID = respData.ConsentID
	consent.AutoApproved = respData.AutoApproved
	consent.ConsentProvider = providerName
	return &consent, nil
}

func (s *Service) GetAccounts(ctx context.Context, clientID string) ([]*domain.Account, error) {
	consents, err := s.consentsProvider.GetConsents(ctx, clientID)
	if err != nil {
		return nil, err
	}
	totalAccounts := make([]*domain.Account, 0)
	for _, consent := range consents {
		if consent.Status == "pending" {
			continue
		}
		token, err := s.token.Token(ctx, consent.ConsentProvider)
		if err != nil {
			return nil, err
		}

		destURL := &url.URL{
			Scheme: "https",
			Host:   consent.ConsentProvider + ".open.bankingapi.ru",
			Path:   "/accounts",
		}

		q := destURL.Query()
		q.Add("client_id", clientID)
		destURL.RawQuery = q.Encode()

		body := http.NoBody
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, destURL.String(), body)
		if err != nil {
			return nil, err
		}
		headers := &http.Header{}
		headers.Add("Authorization", "Bearer "+token.AccessToken)
		headers.Add("X-Requesting-Bank", consent.RequestingBank)
		headers.Add("X-Consent-Id", consent.ConsentID)
		req.Header = *headers
		cl := httpclient.Client()
		s.log.Debug("making request to app", zap.String("provider", consent.ConsentProvider))
		resp, err := cl.Do(req)
		if err != nil {
			return nil, err
		}
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}
		defer func() {
			if closeErr := resp.Body.Close(); err != nil {
				s.log.Error("failed to close response body", zap.Error(closeErr))
			}
		}()
		var res struct {
			Data struct {
				Account []*domain.Account `json:"account" yaml:"account"`
			} `json:"data" yaml:"data"`
		}
		if err := json.Unmarshal(bodyBytes, &res); err != nil {
			return nil, err
		}
		totalAccounts = append(totalAccounts, res.Data.Account...)
	}
	return totalAccounts, nil
}

type TokenProvider interface {
	Token(ctx context.Context, providerName string) (*oauth2.Token, error)
}

type ConsentsProvider interface {
	GetConsents(ctx context.Context, clientID string) ([]*domain.AccountConsent, error)
}
