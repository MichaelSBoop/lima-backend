package accounts

import (
	"context"
	"sync"

	"github.com/MichaelSBoop/lima-backend/internal/domain"
	"go.uber.org/fx"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
)

type Service struct {
	mu sync.Mutex

	consentPoster ConsentPoster
	consentSaver  ConsentSaver
	accountSaver  AccountsSaver
	accountGetter AccountsGetter

	log *zap.Logger
}

type In struct {
	fx.In

	ConsentPoster ConsentPoster
	ConsentSaver  ConsentSaver
	AccountGetter AccountsGetter
	AccountsSaver AccountsSaver
}

func New(log *zap.Logger, params In) *Service {
	return &Service{
		consentSaver:  params.ConsentSaver,
		consentPoster: params.ConsentPoster,
		accountGetter: params.AccountGetter,
		accountSaver:  params.AccountsSaver,
		log:           log,
	}
}

func (s *Service) CreateAccountsConsents(ctx context.Context, consents map[string]*domain.AccountConsent) (map[string]*domain.AccountConsent, error) {
	eg, egCtx := errgroup.WithContext(ctx)
	resMap := make(map[string]*domain.AccountConsent)

	for providerName, consent := range consents {
		eg.Go(func() error {
			consent, err := s.consentPoster.PostConsent(egCtx, *consent, providerName)
			if err != nil {
				return err
			}
			if err := s.consentSaver.SaveConsent(egCtx, consent, providerName); err != nil {
				return err
			}
			s.mu.Lock()
			defer s.mu.Unlock()
			resMap[providerName] = consent
			return nil
		})
	}

	err := eg.Wait()
	if err != nil {
		return nil, err
	}

	return resMap, nil
}

func (s *Service) AggregateAccounts(ctx context.Context, userID string) ([]*domain.Account, error) {
	resAccounts, err := s.accountGetter.GetAccounts(ctx, userID)
	if err != nil {
		return nil, err
	}
	for _, account := range resAccounts {
		if err = s.accountSaver.SaveAccount(ctx, account); err != nil {
			return nil, err
		}
	}

	return resAccounts, nil
}

type ConsentSaver interface {
	SaveConsent(ctx context.Context, consent *domain.AccountConsent, consentProvider string) error
}

type ConsentPoster interface {
	PostConsent(ctx context.Context, consent domain.AccountConsent, providerName string) (*domain.AccountConsent, error)
}

type AccountsSaver interface {
	SaveAccount(ctx context.Context, accounts *domain.Account) error
}

type AccountsGetter interface {
	GetAccounts(ctx context.Context, clientID string) ([]*domain.Account, error)
}
