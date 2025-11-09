package cache

import "time"

type Cache interface {
	Get(key string) (any, bool)
	Set(key string, value any) (any, bool)
	SetWithExpiration(key string, val any, ttl time.Duration) (any, bool)
	Invalidate(key string) (any, bool)
}
