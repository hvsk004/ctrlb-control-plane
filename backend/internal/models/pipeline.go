package models

// Struct for pipeline component (Node)
type PipelineComponent struct {
	ComponentID   int            `json:"component_id"`
	Name          string         `json:"name"`
	ComponentRole string         `json:"component_role"`
	ComponentName string         `json:"component_name"`
	Config        map[string]any `json:"config"`
}

// Struct for dependency/edge
type PipelineEdge struct {
	Source int `json:"source"`
	Target int `json:"target"`
}

// Struct for API response
type PipelineGraph struct {
	Nodes []PipelineComponent `json:"nodes"`
	Edges []PipelineEdge      `json:"edges"`
}
