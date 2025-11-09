package inmem

import (
	"time"

	"github.com/MichaelSBoop/lima-backend/pkg/cache"
	"github.com/maypok86/otter/v2"
	"go.uber.org/zap"
)

type Cache struct {
	log *zap.Logger
	c   *otter.Cache[string, any]
}

func New(cfg Config, log *zap.Logger) (*Cache, error) {
	opts := &otter.Options[string, any]{
		MaximumSize:     cfg.MaximumSize,
		InitialCapacity: cfg.InitialCapacity,
	}

	c, err := otter.New(opts)
	if err != nil {
		return nil, err
	}
	return &Cache{
		c:   c,
		log: log,
	}, nil
}

func (c *Cache) Get(key string) (any, bool) {
	return c.c.GetIfPresent(key)
}
func (c *Cache) Set(key string, val any) (any, bool) {
	return c.c.Set(key, val)
}

func (c *Cache) SetWithExpiration(key string, val any, ttl time.Duration) (any, bool) {
	v, ok := c.c.Set(key, val)
	if !ok {
		return nil, false
	}
	c.c.SetExpiresAfter(key, ttl)
	return v, true
}

func (c *Cache) Invalidate(key string) (any, bool) {
	return c.c.Invalidate(key)
}

var _ cache.Cache = (*Cache)(nil)
