package config

import (
	"time"

	"github.com/spf13/viper"
)

type Postgres struct {
	Name     string `mapstructure:"DB_DATABASE"`
	User     string `mapstructure:"DB_USERNAME"`
	Password string `mapstructure:"DB_PASSWORD"`
	Port     string `mapstructure:"DB_PORT"`
	Host     string `mapstructure:"DB_HOST"`
	MaxConns string `mapstructure:"DB_MAXCONNS"`
	MinConns string `mapstructure:"DB_MINCONNS"`
	// MaxConnIdleTime time.Duration `mapstructure:""`
	// MaxConnLifetime time.Duration `mapstructure:""`
	ConnTimeout time.Duration `mapstructure:"DB_CONNECTION_TIMEOUT"`
}

type App struct {
	Port string `mapstructure:"APP_PORT"`
}

type Config struct {
	Postgres Postgres `mapstructure:",squash"`
	App      App      `mapstructure:",squash"`
}

func LoadConfig(path string) (Config, error) {
	viper.SetConfigFile(path + "/.env")
	viper.AutomaticEnv()

	viper.BindEnv("DB_DATABASE")
	viper.BindEnv("DB_USERNAME")
	viper.BindEnv("DB_PASSWORD")
	viper.BindEnv("DB_PORT")
	viper.BindEnv("DB_HOST")
	viper.BindEnv("DB_MAXCONNS")
	viper.BindEnv("DB_MINCONNS")
	viper.BindEnv("DB_CONNECTION_TIMEOUT")
	viper.BindEnv("APP_PORT")

	viper.SetDefault("DB_CONNECTION_TIMEOUT", 10*time.Second)

	_ = viper.ReadInConfig()

	var config Config
	err := viper.Unmarshal(&config)

	return config, err
}
