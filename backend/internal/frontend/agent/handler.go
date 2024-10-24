package frontendagent

import (
	"net/http"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/utils"
	"github.com/gorilla/mux"
)

type FrontendAgentHandler struct {
	FrontendAgentService *FrontendAgentService
	BasicAuthenticator   *auth.BasicAuthenticator
}

func NewFrontendAgentHandler(frontendAgentServices *FrontendAgentService, basicAuthenticator *auth.BasicAuthenticator) *FrontendAgentHandler {
	return &FrontendAgentHandler{
		FrontendAgentService: frontendAgentServices,
		BasicAuthenticator:   basicAuthenticator,
	}
}

func (f *FrontendAgentHandler) GetAllAgents(w http.ResponseWriter, r *http.Request) {
	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	response, err := f.FrontendAgentService.GetAllAgents()
	if err != nil {
		utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendAgentHandler) GetAgent(w http.ResponseWriter, r *http.Request) {
	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	response, err := f.FrontendAgentService.GetAgent(id)
	if err != nil {
		msg := map[string]string{
			"message": "Agent not found",
		}
		utils.WriteJSONResponse(w, http.StatusNotFound, msg)
		return
	}
	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendAgentHandler) DeleteAgent(w http.ResponseWriter, r *http.Request) {
	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	err = f.FrontendAgentService.DeleteAgent(id)
	if err.Error() == "agent not found" {
		utils.SendJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	if err != nil {
		utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response := map[string]string{
		"message": "Agent deleted successfully",
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendAgentHandler) StartAgent(w http.ResponseWriter, r *http.Request) {
	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	err = f.FrontendAgentService.StartAgent(id)
	if err != nil {
		if err.Error() == "no agent found to start" {
			http.Error(w, err.Error(), http.StatusNotFound) // Return 404 if agent not found
		} else {
			utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	response := map[string]string{
		"message": "Agent started successfully",
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendAgentHandler) StopAgent(w http.ResponseWriter, r *http.Request) {

	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	err = f.FrontendAgentService.StopAgent(id)
	if err != nil {
		if err.Error() == "no agent found to stop" {
			http.Error(w, err.Error(), http.StatusNotFound) // Return 404 if agent not found
		} else {
			utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	response := map[string]string{
		"message": "Agent stopped successfully",
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendAgentHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	response, err := f.FrontendAgentService.GetMetrics(id)
	if err != nil {
		if err.Error() == "no agent found to fetch config" {
			http.Error(w, err.Error(), http.StatusNotFound) // Return 404 if agent not found
		} else {
			utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendAgentHandler) RestartMonitoring(w http.ResponseWriter, r *http.Request) {
	token, err := utils.ExtractTokenFromHeaders(&r.Header)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = f.BasicAuthenticator.ValidateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	err = f.FrontendAgentService.RestartMonitoring(id)
	if err != nil {
		utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
	}

	response := map[string]string{
		"message": "Started monitoring the agent",
	}

	utils.WriteJSONResponse(w, http.StatusOK, response)
}
