package postgres

import (
	"context"

	"github.com/MichaelSBoop/lima-backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func (c *Client) SaveConsent(ctx context.Context, consent *domain.AccountConsent, consentProvider string) error {
	err := c.InTxWithOpts(ctx, func(tx pgx.Tx) error {
		_, err := c.pool.Exec(ctx, `INSERT INTO account_consents (
		client_id, 
		permissions,
		reason, 
		requesting_bank, 
		requesting_bank_name, 
		status, 
		consent_id, 
		auto_approved,
		consent_provider) VALUES (
		@client_id, 
		@permissions, 
		@reason, 
		@requesting_bank, 
		@requesting_bank_name, 
		@status, 
		@consent_id, 
		@auto_approved, 
		@consent_provider)`, pgx.NamedArgs{
			"client_id":            consent.ClientID,
			"permissions":          consent.Permissions,
			"reason":               consent.Reason,
			"requesting_bank":      consent.RequestingBank,
			"requesting_bank_name": consent.RequestingBankName,
			"status":               consent.Status,
			"consent_id":           consent.ConsentID,
			"auto_approved":        consent.AutoApproved,
			"consent_provider":     consentProvider,
		})
		return err
	}, pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return err
	}
	return nil
}

func (c *Client) UpdateConsent(ctx context.Context, consent *domain.AccountConsent, consentProvider string) error {
	err := c.InTxWithOpts(ctx, func(tx pgx.Tx) error {
		_, err := c.pool.Exec(ctx, `UPDATE account_consents
		SET client_id = @client_id, 
		permissions = @permissions, 
		reason = @reason, 
		requesting_bank = @requesting_bank, 
		requesting_bank_name = @requesting_bank_name, 
		status = @status, 
		consent_id = @consent_id, 
		auto_approved = @auto_approved,
		consent_provider = @consent_provider)`, pgx.NamedArgs{
			"client_id":            consent.ClientID,
			"permissions":          consent.Permissions,
			"reason":               consent.Reason,
			"requesting_bank":      consent.RequestingBank,
			"requesting_bank_name": consent.RequestingBankName,
			"status":               consent.Status,
			"consent_id":           consent.ConsentID,
			"auto_approved":        consent.AutoApproved,
			"consent_provider":     consentProvider,
		})
		if err != nil {
			return err
		}
		return nil
	}, pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return err
	}
	return nil
}

func (c *Client) GetConsents(ctx context.Context, clientID string) ([]*domain.AccountConsent, error) {
	consents := make([]*domain.AccountConsent, 0)
	err := c.InTxWithOpts(ctx, func(tx pgx.Tx) error {
		rows, err := c.pool.Query(ctx, `SELECT *
		FROM account_consents WHERE client_id = @client_id`, pgx.NamedArgs{
			"client_id": clientID,
		})
		if err != nil {
			return err
		}
		defer rows.Close()
		for rows.Next() {
			var consent domain.AccountConsent
			if err = rows.Scan(
				&consent.ClientID,
				&consent.Permissions,
				&consent.Reason,
				&consent.RequestingBank,
				&consent.RequestingBankName,
				&consent.Status,
				&consent.ConsentID,
				&consent.AutoApproved,
				&consent.ConsentProvider,
			); err != nil {
				return err
			}
			consents = append(consents, &consent)
		}
		if rows.Err() != nil {
			return rows.Err()
		}
		return nil
	}, pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return nil, err
	}
	return consents, nil
}

func (c *Client) SaveAccount(ctx context.Context, account *domain.Account) error {
	err := c.InTxWithOpts(ctx, func(tx pgx.Tx) error {
		_, err := c.pool.Exec(ctx, `INSERT INTO accounts (
		account_id, 
		currency,
		account_type, 
		nickname, 
		servicer 
		) VALUES (@account_id, @currency, @account_type, @nickname, @servicer) ON CONFLICT (account_id) DO UPDATE SET 
		 currency = EXCLUDED.currency,
		 account_type = EXCLUDED.account_type,
		 nickname = EXCLUDED.nickname,
		 servicer = EXCLUDED.servicer`, pgx.NamedArgs{
			"account_id":   account.AccountID,
			"currency":     account.Currency,
			"account_type": account.AccountType,
			"nickname":     account.Nickname,
			"servicer":     account.Servicer,
		})
		return err
	}, pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return err
	}
	return nil
}
