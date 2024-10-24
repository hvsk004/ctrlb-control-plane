package frontendpipeline

import (
	"time"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

type PipelineWithConfig struct {
	ID           string        `json:"id"`           // Unique ID for the pipeline
	Name         string        `json:"name"`         // Descriptive name for the pipeline
	Type         string        `json:"type"`         // Type/category of the pipeline (e.g., collector, forwarder)
	Version      string        `json:"version"`      // Version of the pipeline
	Hostname     string        `json:"hostname"`     // Hostname where the pipeline is running
	Platform     string        `json:"platform"`     // Operating system platform (e.g., linux, windows)
	Config       models.Config `json:"config"`       // Associated configuration
	IsPipeline   bool          `json:"isPipeline"`   // Indicates if the component is part of a data pipeline
	RegisteredAt time.Time     `json:"registeredAt"` // Timestamp when the pipeline was registered
}
