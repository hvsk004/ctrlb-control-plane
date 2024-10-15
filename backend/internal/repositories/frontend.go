package repositories

import (
	"database/sql"
	"errors"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

func NewFrontendRepository(db *sql.DB) *FrontendRepository {
	return &FrontendRepository{db: db}
}

func (f *FrontendRepository) GetAllAgents() ([]models.Agent, error) {
	var agents []models.Agent

	rows, err := f.db.Query("SELECT * FROM agents")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var agent models.Agent
		err := rows.Scan(&agent.ID, &agent.Name, &agent.Type, &agent.Version, &agent.Hostname, &agent.Platform, &agent.Config, &agent.IsPipeline)
		if err != nil {
			return nil, err
		}
		agents = append(agents, agent)
	}
	// Check if there were any errors encountered during the iteration
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return agents, nil
}

func (f *FrontendRepository) GetAgent(id string) (*models.Agent, error) {
	// Initialize the agent struct
	agent := &models.Agent{}

	// Use parameterized query to prevent SQL injection
	row := f.db.QueryRow("SELECT id, name, type, version, hostname, platform, config, isPipeline FROM agents WHERE id = ?", id)

	// Scan the result into the agent struct
	err := row.Scan(&agent.ID, &agent.Name, &agent.Type, &agent.Version, &agent.Hostname, &agent.Platform, &agent.Config, &agent.IsPipeline)
	if err != nil {
		return nil, err
	}

	return agent, nil
}

func (f *FrontendRepository) DeleteAgent(id string) error {
	// Use parameterized query to prevent SQL injection
	result, err := f.db.Exec("DELETE FROM agents WHERE id = ?", id)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return errors.New("agent not found")
	}

	return nil
}
