package models

import "time"

// Agent represents an agent with relevant details like type, version, and platform.
type Agent struct {
	ID           string    `json:"id"`           // Unique ID for the agent
	Name         string    `json:"name"`         // Descriptive name for the agent
	Type         string    `json:"type"`         // Type/category of the agent (e.g., collector, forwarder)
	Version      string    `json:"version"`      // Version of the agent
	Hostname     string    `json:"hostname"`     // Hostname where the agent is running
	Platform     string    `json:"platform"`     // Operating system platform (e.g., linux, windows)
	ConfigID     string    `json:"configId"`     // Associated configuration ID
	IsPipeline   bool      `json:"isPipeline"`   // Indicates if the agent is part of a data pipeline
	RegisteredAt time.Time `json:"registeredAt"` // Timestamp when the agent was registered
}

// AgentMetrics captures performance and operational data of an agent.
type AgentMetrics struct {
	AgentID            string    `json:"agentId"`            // Unique ID of the agent
	Status             string    `json:"status"`             // Current status (e.g., running, stopped)
	ExportedDataVolume int       `json:"exportedDataVolume"` // Volume of data exported (in MB/GB)
	UptimeSeconds      int       `json:"uptimeSeconds"`      // Uptime in seconds
	DroppedRecords     int       `json:"droppedRecords"`     // Number of records dropped by the agent
	UpdatedAt          time.Time `json:"updatedAt"`          // Timestamp of the last metrics update
}

// AgentStatus tracks the current status of an agent including retry attempts.
type AgentStatus struct {
	AgentID        string    `json:"agentId"`        // Unique ID of the agent
	Hostname       string    `json:"hostname"`       // Hostname where the agent is running
	CurrentStatus  string    `json:"currentStatus"`  // Status of the agent (e.g., online, offline)
	RetryRemaining int       `json:"retryRemaining"` // Number of retry attempts left
	UpdatedAt      time.Time `json:"updatedAt"`      // Timestamp of the last status update
}

type Config struct {
	ID          string    `json:"id"`          // Unique ID of the config
	Description string    `json:"description"` // Brief description of the config
	Config      string    `json:"config"`      // Configuration data (usually in JSON or YAML format)
	TargetAgent string    `json:"targetAgent"` // Type of agent this configuration is applicable to
	CreatedAt   time.Time `json:"createdAt"`   // Timestamp when the config was created
	UpdatedAt   time.Time `json:"updatedAt"`   // Timestamp when the config was last updated
}
