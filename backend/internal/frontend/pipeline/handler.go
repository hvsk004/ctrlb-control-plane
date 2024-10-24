package frontendpipeline

import (
	"net/http"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/utils"
	"github.com/gorilla/mux"
)

type FrontendPipelineHandler struct {
	FrontendPipelineService *FrontendPipelineService
	BasicAuthenticator      *auth.BasicAuthenticator
}

func NewFrontendPipelineHandler(frontendAgentServices *FrontendPipelineService, basicAuthenticator *auth.BasicAuthenticator) *FrontendPipelineHandler {
	return &FrontendPipelineHandler{
		FrontendPipelineService: frontendAgentServices,
		BasicAuthenticator:      basicAuthenticator,
	}
}
func (f *FrontendPipelineHandler) PlaceHolder(w http.ResponseWriter, r *http.Request) {
	utils.WriteJSONResponse(w, http.StatusOK, "")
}

func (f *FrontendPipelineHandler) GetAllPipelines(w http.ResponseWriter, r *http.Request) {
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

	response, err := f.FrontendPipelineService.GetAllPipelines()
	if err != nil {
		utils.SendJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendPipelineHandler) GetPipeline(w http.ResponseWriter, r *http.Request) {
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

	response, err := f.FrontendPipelineService.GetPipeline(id)
	if err != nil {
		msg := map[string]string{
			"message": "Agent not found",
		}
		utils.WriteJSONResponse(w, http.StatusNotFound, msg)
		return
	}
	utils.WriteJSONResponse(w, http.StatusOK, response)
}

func (f *FrontendPipelineHandler) DeletePipeline(w http.ResponseWriter, r *http.Request) {
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

	err = f.FrontendPipelineService.DeletePipeline(id)
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

func (f *FrontendPipelineHandler) StartPipeline(w http.ResponseWriter, r *http.Request) {
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

	err = f.FrontendPipelineService.StartPipeline(id)
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

func (f *FrontendPipelineHandler) StopPipeline(w http.ResponseWriter, r *http.Request) {

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

	err = f.FrontendPipelineService.StopPipeline(id)
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

func (f *FrontendPipelineHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
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

	response, err := f.FrontendPipelineService.GetMetrics(id)
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
