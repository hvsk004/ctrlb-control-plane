package frontendagent

import (
	"time"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

type AgentWithConfig struct {
	ID           string        `json:"id"`           // Unique ID for the agent
	Name         string        `json:"name"`         // Descriptive name for the agent
	Type         string        `json:"type"`         // Type/category of the agent (e.g., collector, forwarder)
	Version      string        `json:"version"`      // Version of the agent
	Hostname     string        `json:"hostname"`     // Hostname where the agent is running
	Platform     string        `json:"platform"`     // Operating system platform (e.g., linux, windows)
	Config       models.Config `json:"config"`       // Associated configuration
	IsPipeline   bool          `json:"isPipeline"`   // Indicates if the agent is part of a data pipeline
	RegisteredAt time.Time     `json:"registeredAt"` // Timestamp when the agent was registered
}
