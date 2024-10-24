package frontendpipeline

import (
	"fmt"
	"net/http"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

type FrontendPipelineService struct {
	FrontendRepository *FrontendPipelineRepository
}

func NewFrontendPipelineService(frontendRepository *FrontendPipelineRepository) *FrontendPipelineService {
	return &FrontendPipelineService{
		FrontendRepository: frontendRepository,
	}
}

func (f *FrontendPipelineService) GetAllPipelines() ([]models.Agent, error) {
	agents, err := f.FrontendRepository.GetAllPipelines()
	if err != nil {
		return nil, err
	}
	return agents, nil
}

func (f *FrontendPipelineService) GetPipeline(id string) (*PipelineWithConfig, error) {
	agent, err := f.FrontendRepository.GetPipeline(id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	config, err := f.FrontendRepository.GetConfig(agent.ConfigID)
	if err != nil {
		return nil, err
	}

	agentWithConfig := &PipelineWithConfig{
		ID:           agent.ID,
		Name:         agent.Name,
		Type:         agent.Type,
		Version:      agent.Version,
		Hostname:     agent.Hostname,
		Platform:     agent.Platform,
		Config:       *config,
		IsPipeline:   agent.IsPipeline,
		RegisteredAt: agent.RegisteredAt,
	}

	return agentWithConfig, nil
}

func (f *FrontendPipelineService) DeletePipeline(id string) error {
	agent, err := f.FrontendRepository.GetPipeline(id)
	if err != nil {
		return err
	}

	err = f.FrontendRepository.DeletePipeline(agent.ID)
	if err != nil {
		return err
	}

	//Shutting down the pipeline
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

func (f *FrontendPipelineService) StartPipeline(id string) error {

	// starting registered agent
	agent, err := f.FrontendRepository.GetPipeline(id)
	if err != nil {
		return err
	}

	// prepare the URL for the start pipeline request using the extracted hostname
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

func (f *FrontendPipelineService) StopPipeline(id string) error {
	// starting registered agent
	agent, err := f.FrontendRepository.GetPipeline(id)
	if err != nil {
		return err
	}

	// prepare the URL for the start pipeline request using the extracted hostname
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

func (f *FrontendPipelineService) GetMetrics(id string) (*models.AgentMetrics, error) {
	agentMetrics, err := f.FrontendRepository.GetMetrics(id)
	if err != nil {
		return nil, err
	}

	return agentMetrics, nil
}
