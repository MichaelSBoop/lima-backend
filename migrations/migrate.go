package migrations

import (
	"embed"
	"errors"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/pgx/v5"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
)

//go:embed *.sql
var migration embed.FS

func ApplyMigrations(pool *pgxpool.Pool) error {
	sourceInstance, err := iofs.New(migration, ".")
	if err != nil {
		return err
	}
	db := stdlib.OpenDBFromPool(pool)
	drv, err := pgx.WithInstance(db, &pgx.Config{MigrationsTable: "lima_migrations"})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithInstance("iofs", sourceInstance, ".", drv)
	if err != nil {
		return err
	}
	if err = m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}
	return nil
}
