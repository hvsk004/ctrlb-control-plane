package services

import (
	"fmt"
	"net/http"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/repositories"
)

func NewFrontendService(frontendRepository *repositories.FrontendRepository) *FrontendService {
	return &FrontendService{
		FrontendRepository: frontendRepository,
	}
}

func (a *FrontendService) GetAllAgents() ([]models.Agent, error) {
	agents, err := a.FrontendRepository.GetAllAgents()
	if err != nil {
		return nil, err
	}
	return agents, nil
}

func (a *FrontendService) GetAgent(id string) (*models.Agent, error) {
	agent, err := a.FrontendRepository.GetAgent(id)
	if err != nil {
		return nil, err
	}
	return agent, nil
}

func (a *FrontendService) DeleteAgent(id string) error {
	agent, err := a.FrontendRepository.GetAgent(id)
	if err != nil {
		return err
	}

	err = a.FrontendRepository.DeleteAgent(agent.ID)
	if err != nil {
		return err
	}

	//Shutting down the agent
	url := fmt.Sprintf("http://%s:443/api/v1/shutdown", agent.Hostname)
	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		return fmt.Errorf("error encountered while removing agent: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("error encountered while removing agent: %s", resp.Status)
	}

	//TODO:Remove agent from queue

	return err
}

func (f *FrontendService) StartAgent(id string) error {

	// starting registered agent
	agent, err := f.FrontendRepository.GetAgent(id)
	if err != nil {
		return err
	}

	// prepare the URL for the start agent request using the extracted hostname
	url := fmt.Sprintf("http://%s:443/api/v1/start", agent.Hostname)
	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		return fmt.Errorf("error encountered while starting agent: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("error encountered while starting agent: %s", resp.Status)
	}

	return nil
}

func (f *FrontendService) StopAgent(id string) error {
	// starting registered agent
	agent, err := f.FrontendRepository.GetAgent(id)
	if err != nil {
		return err
	}

	// prepare the URL for the start agent request using the extracted hostname
	url := fmt.Sprintf("http://%s:443/api/v1/stop", agent.Hostname)
	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		return fmt.Errorf("error encountered while stopping agent: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("error encountered while stopping agent: %s", resp.Status)
	}

	return nil
}

func (f *FrontendService) GetConfig(id string) (*string, error) {
	// starting registered agent
	agent, err := f.FrontendRepository.GetAgent(id)
	if err != nil {
		return nil, err
	}

	config, err := f.FrontendRepository.GetConfig(agent.ConfigID)
	if err != nil {
		return nil, err
	}

	return &config.Config, nil
}

func (f *FrontendService) GetMetrics(id string) (*models.AgentMetrics, error) {
	// starting registered agent
	agent, err := f.FrontendRepository.GetAgent(id)
	if err != nil {
		return nil, err
	}

	agentMetrics, err := f.FrontendRepository.GetMetrics(agent.ConfigID)
	if err != nil {
		return nil, err
	}

	return agentMetrics, nil
}
