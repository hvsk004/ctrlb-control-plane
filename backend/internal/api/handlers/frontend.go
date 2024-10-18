package handler

import (
	"net/http"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/services"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/utils"
	"github.com/gorilla/mux"
)

func NewFrontendHandler(frontendServices *services.FrontendService, basicAuthenticator *auth.BasicAuthenticator) *FrontendHandler {
	return &FrontendHandler{
		FrontendService:    frontendServices,
		BasicAuthenticator: basicAuthenticator,
	}
}
func (f *FrontendHandler) PlaceHolder(w http.ResponseWriter, r *http.Request) {
	utils.WriteJSONResponse(w, http.StatusOK, "")
}

func (f *FrontendHandler) GetAllAgents(w http.ResponseWriter, r *http.Request) {
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

	response, err := f.FrontendService.GetAllAgents()
	if err != nil {
		utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendHandler) GetAgent(w http.ResponseWriter, r *http.Request) {
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

	response, err := f.FrontendService.GetAgent(id)
	if err != nil {
		msg := map[string]string{
			"message": "Agent not found",
		}
		utils.WriteJSONResponse(w, http.StatusNotFound, msg)
		return
	}
	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendHandler) DeleteAgent(w http.ResponseWriter, r *http.Request) {
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

	err = f.FrontendService.DeleteAgent(id)
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

func (f *FrontendHandler) StartAgent(w http.ResponseWriter, r *http.Request) {
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

	err = f.FrontendService.StartAgent(id)
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

func (f *FrontendHandler) StopAgent(w http.ResponseWriter, r *http.Request) {

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

	err = f.FrontendService.StopAgent(id)
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

func (f *FrontendHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
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

	response, err := f.FrontendService.GetMetrics(id)
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
