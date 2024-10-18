package models

type UserRegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AgentRequest struct {
	AgentID string `json:"agentId"`
}

type AgentRegisterRequest struct {
	Type       string `json:"type"`
	Version    string `json:"version"`
	Hostname   string `json:"hostname"`
	Platform   string `json:"platform"`
	IsPipeline bool   `json:"isPipeline"`
}

type ConfigUpdateRequest struct {
	AgentID string `json:"agentId"`
	Config  string `json:"config"`
}
