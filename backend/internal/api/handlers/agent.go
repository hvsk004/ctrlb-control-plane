package handler

import (
	"log"
	"net/http"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/services"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/utils"
)

func NewAgentHandler(agentServices *services.AgentService, basicAuthenticator *auth.BasicAuthenticator) *AgentHandler {
	return &AgentHandler{
		AgentService:       agentServices,
		BasicAuthenticator: basicAuthenticator,
	}
}

func (a *AgentHandler) RegisterAgent(w http.ResponseWriter, r *http.Request) {
	var registerRequest models.AgentRegisterRequest

	if err := utils.UnmarshalJSONRequest(r, &registerRequest); err != nil {
		log.Println("Invalid request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	reponse, err := a.AgentService.RegisterAgent(registerRequest)
	if err != nil {
		utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, reponse)

}

func (a *AgentHandler) GetAgentUptime(w http.ResponseWriter, r *http.Request) {
	var agentUptimeRequest models.AgentRequest

	if err := utils.UnmarshalJSONRequest(r, &agentUptimeRequest); err != nil {
		log.Println("Invalid request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := a.AgentService.GetAgentUptime(agentUptimeRequest)
	if err != nil {
		if err.Error() == "no agent found to fetch uptime" {
			http.Error(w, err.Error(), http.StatusNotFound) // Return 404 if agent not found
		} else {
			utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (a *AgentHandler) GetAgentStatus(w http.ResponseWriter, r *http.Request) {
	var agentStatusRequest models.AgentRequest

	if err := utils.UnmarshalJSONRequest(r, &agentStatusRequest); err != nil {
		log.Println("Invalid request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := a.AgentService.GetAgentStatus(agentStatusRequest)
	if err != nil {
		if err.Error() == "no agent found to fetch status" {
			http.Error(w, err.Error(), http.StatusNotFound) // Return 404 if agent not found
		} else {
			utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}
