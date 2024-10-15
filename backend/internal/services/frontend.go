package services

import (
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
	//TODO: Remove agent from queue
	err := a.FrontendRepository.DeleteAgent(id)
	return err
}
