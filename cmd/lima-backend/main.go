package main

import (
	"io"
	"log"
	"os"

	"github.com/MichaelSBoop/lima-backend/config"
	appfx "github.com/MichaelSBoop/lima-backend/internal/fx"
	"github.com/spf13/pflag"
	"go.uber.org/zap"
	"go.yaml.in/yaml/v3"
)

func main() {
	cfg := initConfig()
	app := appfx.New(cfg)
	app.Run()
}

// initConfig initializes configuration with provided flags and environment variables
func initConfig() *config.Config {
	// viper.SetEnvPrefix("LIMA_BACKEND")
	flags := parseFlags()

	var (
		cfgPath string
		err     error
	)
	fConf, _ := flags.GetString("config")
	if fConf != "" {
		cfgPath = fConf
	}

	file, err := os.Open(cfgPath)
	if err != nil {
		log.Fatal(err)
	}
	contents, err := io.ReadAll(file)
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		if closeErr := file.Close(); closeErr != nil {
			zap.L().Error("failed to close file", zap.Error(closeErr))
		}
	}()
	var cfg config.Config
	if err := yaml.Unmarshal(contents, &cfg); err != nil {
		log.Fatal(err)
	}
	return &cfg
}

func parseFlags() *pflag.FlagSet {
	flags := pflag.NewFlagSet("LIMA_BACKEND", pflag.ExitOnError)
	var cfg string
	flags.StringVarP(&cfg, "config", "c", "", "Path to configuration file")
	if err := flags.Parse(os.Args); err != nil {
		log.Fatal(err)
	}
	return flags
}
