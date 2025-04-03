package frontendpipeline

import "github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"

type CreatePipelineRequest struct {
	Name          string               `json:"name"`
	CreatedBy     string               `json:"created_by"`
	AgentIDs      []int                `json:"agent_ids"`
	PipelineGraph models.PipelineGraph `json:"pipeline_graph"`
}

type Pipeline struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Agents        int    `json:"agents"`
	IncomingBytes int    `json:"incoming_bytes"`
	OutgoingBytes int    `json:"outgoing_bytes"`
	UpdatedAt     int    `json:"updatedAt"`
}

type PipelineInfo struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	CreatedBy string `json:"created_by"`
	CreatedAt int    `json:"created_at"`
	UpdatedAt int    `json:"updated_at"`
}
