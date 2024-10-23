package models

import "time"

type Config struct {
	ID          string    `json:"id"`          // Unique ID of the config
	Name        string    `json:"name"`        // Name for config
	Description string    `json:"description"` // Brief description of the config
	Config      string    `json:"config"`      // Configuration data (usually in JSON or YAML format)
	TargetAgent string    `json:"targetAgent"` // Type of agent this configuration is applicable to
	CreatedAt   time.Time `json:"createdAt"`   // Timestamp when the config was created
	UpdatedAt   time.Time `json:"updatedAt"`   // Timestamp when the config was last updated
}

type FluentBitConfig struct {
	Service  map[string]interface{} `json:"service" yaml:"service"`
	Pipeline struct {
		Inputs  []map[string]interface{} `json:"inputs" yaml:"inputs"`
		Filters []map[string]interface{} `json:"filters" yaml:"filters"`
		Outputs []map[string]interface{} `json:"outputs" yaml:"outputs"`
	} `json:"pipeline" yaml:"pipeline"`
}

type OTELConfig struct {
	Receivers  map[string]interface{} `json:"receivers" yaml:"receivers"`
	Processors map[string]interface{} `json:"processors" yaml:"processors"`
	Exporters  map[string]interface{} `json:"exporters" yaml:"exporters"`
	Service    struct {
		Pipelines map[string]struct {
			Receivers  []string `json:"receivers" yaml:"receivers"`
			Processors []string `json:"processors" yaml:"processors"`
			Exporters  []string `json:"exporters" yaml:"exporters"`
		} `json:"pipelines" yaml:"pipelines"`
	} `json:"service" yaml:"service"`
}
