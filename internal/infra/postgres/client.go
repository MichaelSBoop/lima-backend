package postgres

import (
	"context"
	"errors"

	"github.com/MichaelSBoop/lima-backend/migrations"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

var ErrFailedToRollback = errors.New("failed to execute rollback on transaction")

type Client struct {
	log  *zap.Logger
	pool *pgxpool.Pool
	cfg  *Config
}

func New(logger *zap.Logger, lc fx.Lifecycle, cfg Config) (*Client, error) {
	pgxcfg, err := pgxpool.ParseConfig(cfg.String())
	if err != nil {
		return nil, err
	}
	pool, err := pgxpool.NewWithConfig(context.Background(), pgxcfg)
	if err != nil {
		return nil, err
	}
	cl := &Client{
		pool: pool,
		cfg:  &cfg,
		log:  logger,
	}
	lc.Append(
		fx.Hook{
			OnStart: func(ctx context.Context) error {
				if err := migrations.ApplyMigrations(cl.pool); err != nil {
					cl.log.Error("failed to apply migration", zap.Error(err))
					cl.pool.Close()
					return err
				}
				return nil
			},
			OnStop: func(ctx context.Context) error {
				cl.pool.Close()
				return nil
			},
		},
	)
	return cl, nil
}

func (c *Client) InTxWithOpts(ctx context.Context, f func(tx pgx.Tx) error, txOpts pgx.TxOptions) error {
	tx, err := c.pool.BeginTx(ctx, txOpts)
	if err != nil {
		return err
	}
	if err = f(tx); err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			c.log.Error(ErrFailedToRollback.Error(), zap.Error(rbErr))
			return errors.Join(err, rbErr)
		}
	}
	return tx.Commit(ctx)
}
