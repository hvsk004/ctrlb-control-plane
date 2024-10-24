package api

import (
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/agent"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	frontendagent "github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/frontend/agent"
	frontendpipeline "github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/frontend/pipeline"
	"github.com/gorilla/mux"
)

func NewRouter(agentService *agent.AgentService, authService *auth.AuthService, frontendAgentService *frontendagent.FrontendAgentService, frontendPipelineService *frontendpipeline.FrontendPipelineService, basicAuth *auth.BasicAuthenticator) *mux.Router {
	router := mux.NewRouter()

	agentHandler := agent.NewAgentHandler(agentService, basicAuth)

	authHandler := auth.NewAuthHandler(authService, basicAuth)
	frontendAgentHandler := frontendagent.NewFrontendAgentHandler(frontendAgentService, basicAuth)
	frontendPipelineHandler := frontendpipeline.NewFrontendPipelineHandler(frontendPipelineService, basicAuth)

	authAPIsV1 := router.PathPrefix("/api/auth/v1").Subrouter()

	authAPIsV1.HandleFunc("/register", authHandler.Register).Methods("POST")
	authAPIsV1.HandleFunc("/login", authHandler.Login).Methods("POST")

	agentAPIsV1 := router.PathPrefix("/api/agent/v1").Subrouter()

	agentAPIsV1.HandleFunc("/register", agentHandler.RegisterAgent).Methods("PUT")

	frontendAgentAPIsV1 := router.PathPrefix("/api/frontend/v1").Subrouter()

	frontendAgentAPIsV1.HandleFunc("/agents", frontendAgentHandler.GetAllAgents).Methods("GET")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}", frontendAgentHandler.GetAgent).Methods("GET")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}", frontendAgentHandler.DeleteAgent).Methods("DELETE")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}/start", frontendAgentHandler.StartAgent).Methods("POST")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}/stop", frontendAgentHandler.StopAgent).Methods("POST")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}/metrics", frontendAgentHandler.GetMetrics).Methods("GET")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}/restart-monitoring", frontendAgentHandler.StartAgent).Methods("POST")

	frontendAgentAPIsV1.HandleFunc("/pipeline", frontendPipelineHandler.GetAllPipelines).Methods("GET")
	frontendAgentAPIsV1.HandleFunc("/pipeline/{id}", frontendPipelineHandler.GetPipeline).Methods("GET")
	frontendAgentAPIsV1.HandleFunc("/pipeline/{id}", frontendPipelineHandler.DeletePipeline).Methods("DELETE")
	frontendAgentAPIsV1.HandleFunc("/pipeline/{id}/start", frontendPipelineHandler.StartPipeline).Methods("POST")
	frontendAgentAPIsV1.HandleFunc("/pipeline/{id}/stop", frontendPipelineHandler.StopPipeline).Methods("POST")
	frontendAgentAPIsV1.HandleFunc("/agents/{id}/metrics", frontendPipelineHandler.GetMetrics).Methods("GET")

	return router
}
