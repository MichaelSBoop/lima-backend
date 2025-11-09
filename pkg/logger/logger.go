package logger

import (
	"go.uber.org/zap"
)

func New(cfg Config) (*zap.Logger, error) {
	return zap.NewDevelopment()
}
