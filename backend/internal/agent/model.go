package agent

import "time"

// AgentRegisterRequest represents the request payload for registering a new agent.
type AgentRegisterRequest struct {
	Type       string `json:"type"`       // The type of the agent (e.g., worker, collector)
	Version    string `json:"version"`    // The version of the agent
	Hostname   string `json:"hostname"`   // The hostname of the machine running the agent
	Platform   string `json:"platform"`   // The platform (e.g., OS) the agent is running on
	IsPipeline bool   `json:"isPipeline"` // Indicates if the agent is part of a data pipeline
}

// AgentMetrics captures performance and operational data of an agent.
type AgentMetrics struct {
	AgentID            string    `json:"agentId"`            // Unique ID of the agent
	Status             string    `json:"status"`             // Current status (e.g., running, stopped)
	ExportedDataVolume int       `json:"exportedDataVolume"` // Volume of data exported (in MB/GB)
	UptimeSeconds      int       `json:"uptimeSeconds"`      // Uptime of the agent in seconds
	DroppedRecords     int       `json:"droppedRecords"`     // Number of records dropped by the agent
	UpdatedAt          time.Time `json:"updatedAt"`          // Timestamp of the last metrics update
}
