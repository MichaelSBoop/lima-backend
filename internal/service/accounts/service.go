package accounts

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/MichaelSBoop/lima-backend/internal/domain"
)

type Service struct {
	client TokenizedClient
	saver  SaveConsent
}

func New(client TokenizedClient, saver SaveConsent) *Service {
	return &Service{
		client: client,
	}
}

func (s *Service) CreateAccountsConsent(ctx context.Context, permissions []string, clientID, bankName, reason string) (string, error) {
	c, err := s.client.ClientWithToken(ctx, bankName)
	if err != nil {
		return "", err
	}
	destURL := url.URL{
		Scheme: "https",
		Host:   bankName + ".open.bankingapi.ru",
		Path:   url.QueryEscape("/account-consents/request"),
	}
	body := struct {
		ClientID           string   `json:"client_id" yaml:"client_id"`
		Permissions        []string `json:"permissions" yaml:"permissions"`
		Reason             string   `json:"reason" yaml:"reason"`
		RequestingBank     string   `json:"requesting_bank" yaml:"requesting_bank"`
		RequestingBankName string   `json:"requesting_bank_name" yaml:"requesting_bank_name"`
	}{
		ClientID:       clientID,
		Permissions:    permissions,
		Reason:         reason,
		RequestingBank: bankName,
	}
	data, err := json.Marshal(body)
	if err != nil {
		return "", err
	}
	req, err := http.NewRequest(http.MethodPost, destURL.String(), bytes.NewBuffer(data))
	if err != nil {
		return "", err
	}
	resp, err := c.Do(req)
	if err != nil {
		return "", err
	}
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var respData struct {
		Status       string
		ConsentID    string
		AutoApproved bool
	}
	if err := json.Unmarshal(bodyBytes, &respData); err != nil {
		return "", err
	}
	if err := s.saver.SaveConsent(ctx, &domain.AccountConsent{
		ClientID:       clientID,
		Permissions:    permissions,
		Reason:         reason,
		RequestingBank: bankName,
		Status:         respData.Status,
		ConsentID:      respData.ConsentID,
		AutoApproved:   respData.AutoApproved,
	}); err != nil {
		return "", err
	}
	return respData.ConsentID, nil
}

type TokenizedClient interface {
	ClientWithToken(ctx context.Context, providerName string) (*http.Client, error)
}

type SaveConsent interface {
	SaveConsent(ctx context.Context, consent *domain.AccountConsent) error
}
