package frontendpipeline

import (
	"time"
)

// Pipeline represents a pipeline with relevant details like type, version, and platform.
type Pipeline struct {
	ID           string    `json:"id"`           // Unique ID for the pipeline
	Name         string    `json:"name"`         // Descriptive name for the pipeline
	Type         string    `json:"type"`         // Type/category of the pipeline (e.g., collector, forwarder)
	Version      string    `json:"version"`      // Version of the pipeline
	Hostname     string    `json:"hostname"`     // Hostname where the pipeline is running
	Platform     string    `json:"platform"`     // Operating system platform (e.g., linux, windows)
	ConfigID     string    `json:"configId"`     // Associated configuration ID
	IsPipeline   bool      `json:"isPipeline"`   // Indicates if the component is a data pipeline
	RegisteredAt time.Time `json:"registeredAt"` // Timestamp when the pipeline was registered
}
