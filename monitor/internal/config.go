package internal

import "github.com/jinzhu/configor"

func LoadConfig() *Config {
	config := Config{}

	configor.Load(&config, "config.yml")

	return &config
}
