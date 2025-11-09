package postgres

import (
	"context"

	"github.com/MichaelSBoop/lima-backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func (c *Client) SaveConsent(ctx context.Context, consent *domain.AccountConsent) error {
	err := c.InTxWithOpts(ctx, func(tx pgx.Tx) error {
		_, err := c.pool.Exec(ctx, `INSERT INTO 
		client_id, 
		permissions,
		reason, 
		requesting_bank, 
		requesting_bank_name, 
		status, 
		consent_id, 
		auto_approved VALUES (:client_id, :permissions, :reason, :requesting_bank, :requesting_bank_name, :status, :consent_id, :auto_approved)`, pgx.NamedArgs{
			"client_id":            consent.ClientID,
			"permissions":          consent.Permissions,
			"reason":               consent.Reason,
			"requesting_bank":      consent.RequestingBank,
			"requesting_bank_name": consent.RequestingBankName,
			"status":               consent.Status,
			"consent_id":           consent.ConsentID,
			"auto_approved":        consent.AutoApproved,
		})
		if err != nil {
			return err
		}
		return nil
	}, pgx.TxOptions{IsoLevel: pgx.RepeatableRead})
	if err != nil {
		return err
	}
	return nil
}
