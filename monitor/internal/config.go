package internal

import (
	"io/ioutil"
	"path/filepath"

	"encoding/json"
)

func LoadConfig() (*Config, error) {
	config := Config{}
	fpath := filepath.Join("public", "data", "config.json")

	file, err := ioutil.ReadFile(fpath)
	if err != nil {
		return nil, err
	}
	json.Unmarshal([]byte(file), &config)

	return &config, nil
}
