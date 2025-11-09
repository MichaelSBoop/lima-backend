package postgres

import (
	"fmt"
	"strings"
	"time"
)

type Config struct {
	User                      string        `json:"user" yaml:"user"`
	Password                  string        `json:"password" yaml:"password"`
	Host                      string        `json:"host" yaml:"host"`
	Port                      int           `json:"port" yaml:"port"`
	DBName                    string        `json:"db_name" yaml:"db_name"`
	SSLMode                   string        `json:"ssl_mode" yaml:"ssl_mode"`
	PoolMaxConns              int           `json:"pool_max_conns" yaml:"pool_max_conns"`
	PoolMinConns              int           `json:"pool_min_conns" yaml:"pool_min_conns"`
	PoolMaxConnLifetime       time.Duration `json:"pool_max_conn_lifetime" yaml:"pool_max_conn_lifetime"`
	PoolMaxConnIdleTime       time.Duration `json:"pool_max_conn_idle_time" yaml:"pool_max_conn_idle_time"`
	PoolHealthCheckPeriod     time.Duration `json:"pool_health_check_period" yaml:"pool_health_check_period"`
	PoolMaxConnLifetimeJitter time.Duration `json:"pool_max_conn_lifetime_jitter" yaml:"pool_max_conn_lifetime_jitter"`
}

func (c Config) String() string {
	var sb strings.Builder
	sb.Grow(12)
	if c.User != "" {
		sb.WriteString(fmt.Sprintf("user=%s ", c.User))
	}
	if c.Password != "" {
		sb.WriteString(fmt.Sprintf("password=%s ", c.Password))
	}
	if c.Host != "" {
		sb.WriteString(fmt.Sprintf("host=%s ", c.Host))
	}
	if c.Port != 0 {
		sb.WriteString(fmt.Sprintf("port=%d ", c.Port))
	}
	if c.DBName != "" {
		sb.WriteString(fmt.Sprintf("dbname=%s ", c.DBName))
	}
	if c.SSLMode != "" {
		sb.WriteString(fmt.Sprintf("sslmode=%s ", c.SSLMode))
	}
	if c.PoolMaxConns != 0 {
		sb.WriteString(fmt.Sprintf("pool_max_conns=%d ", c.PoolMaxConns))
	}
	if c.PoolMinConns != 0 {
		sb.WriteString(fmt.Sprintf("pool_min_conns=%d ", c.PoolMinConns))
	}
	if c.PoolMaxConnLifetime != 0 {
		sb.WriteString(fmt.Sprintf("pool_max_conn_lifetime=%s ", c.PoolMaxConnLifetime.String()))
	}
	if c.PoolMaxConnIdleTime != 0 {
		sb.WriteString(fmt.Sprintf("pool_max_conn_idle_time=%s ", c.PoolMaxConnIdleTime.String()))
	}
	if c.PoolHealthCheckPeriod != 0 {
		sb.WriteString(fmt.Sprintf("pool_health_check_period=%s ", c.PoolHealthCheckPeriod.String()))
	}
	if c.PoolMaxConnLifetimeJitter != 0 {
		sb.WriteString(fmt.Sprintf("pool_max_conn_lifetime_jitter=%s ", c.PoolMaxConnLifetimeJitter.String()))
	}
	return sb.String()
}
