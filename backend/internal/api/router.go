package api

import (
	handler "github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/api/handlers"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/services"
	"github.com/gorilla/mux"
)

func NewRouter(services *services.Services, basicAuth *auth.BasicAuthenticator) *mux.Router {
	router := mux.NewRouter()

	agentHandler := handler.NewAgentHandler(services.AgentService, basicAuth)
	authHandler := handler.NewAuthHandler(services.AuthService, basicAuth)
	frontendHandler := handler.NewFrontendHandler(services.FrontendService, basicAuth)

	authAPIsV1 := router.PathPrefix("/api/auth/v1").Subrouter()

	authAPIsV1.HandleFunc("/register", authHandler.Register).Methods("POST")
	authAPIsV1.HandleFunc("/login", authHandler.Login).Methods("POST")

	agentAPIsV1 := router.PathPrefix("/api/agent/v1").Subrouter()

	agentAPIsV1.HandleFunc("/register", agentHandler.RegisterAgent).Methods("PUT")
	agentAPIsV1.HandleFunc("/config", agentHandler.UpdateConfig).Methods("PUT")
	agentAPIsV1.HandleFunc("/config", agentHandler.GetAgentConfig).Methods("GET")
	agentAPIsV1.HandleFunc("/uptime", agentHandler.GetAgentUptime).Methods("GET")
	agentAPIsV1.HandleFunc("/status", agentHandler.GetAgentStatus).Methods("GET")

	frontendAPIsV1 := router.PathPrefix("/api/frontend/v1").Subrouter()

	frontendAPIsV1.HandleFunc("/agents", frontendHandler.GetAllAgents).Methods("GET")
	frontendAPIsV1.HandleFunc("/agents/{id}", frontendHandler.GetAgent).Methods("GET")
	frontendAPIsV1.HandleFunc("/agents/{id}", frontendHandler.DeleteAgent).Methods("DELETE")
	frontendAPIsV1.HandleFunc("/agents/{id}/start", frontendHandler.StartAgent).Methods("POST")
	frontendAPIsV1.HandleFunc("/agents/{id}/stop", frontendHandler.StopAgent).Methods("POST")
	frontendAPIsV1.HandleFunc("/agents/{id}/config", frontendHandler.GetConfig).Methods("GET")
	frontendAPIsV1.HandleFunc("/agents/{id}/metrics", frontendHandler.GetMetrics).Methods("GET")

	return router
}
