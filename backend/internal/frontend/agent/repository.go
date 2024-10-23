package frontendagent

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

type FrontendAgentRepository struct {
	db *sql.DB
}

func NewFrontendAgentRepository(db *sql.DB) *FrontendAgentRepository {
	return &FrontendAgentRepository{db: db}
}

func (f *FrontendAgentRepository) GetAllAgents() ([]Agent, error) {
	var agents []Agent

	rows, err := f.db.Query("SELECT id, name, type, version, hostname, platform, configId, registeredAt FROM agents WHERE isPipeline = false")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var registeredAt sql.NullTime
		var agent Agent
		err := rows.Scan(&agent.ID, &agent.Name, &agent.Type, &agent.Version, &agent.Hostname, &agent.Platform, &agent.ConfigID, &registeredAt)
		if err != nil {
			return nil, err
		}

		if registeredAt.Valid {
			agent.RegisteredAt = registeredAt.Time // Assign if valid
		}
		agents = append(agents, agent)
	}
	// Check if there were any errors encountered during the iteration
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return agents, nil
}

func (f *FrontendAgentRepository) GetAgent(id string) (*Agent, error) {
	// Initialize the agent struct
	agent := &Agent{}

	// Use parameterized query to prevent SQL injection
	row := f.db.QueryRow("SELECT id, name, type, version, hostname, platform, configID, isPipeline, registeredAt FROM agents WHERE id = ?", id)

	// Scan the result into the agent struct
	err := row.Scan(&agent.ID, &agent.Name, &agent.Type, &agent.Version, &agent.Hostname, &agent.Platform, &agent.ConfigID, &agent.IsPipeline, &agent.RegisteredAt)
	if err != nil {
		return nil, err
	}

	return agent, nil
}

func (f *FrontendAgentRepository) DeleteAgent(id string) error {
	// Execute the DELETE query
	result, err := f.db.Exec("DELETE FROM agents WHERE id = ?", id)
	if err != nil {
		return err
	}

	// Check if no rows were affected (i.e., nothing was deleted)
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no agent found with id %s", id)
	}

	return nil
}

func (f *FrontendAgentRepository) GetConfig(id string) (*models.Config, error) {
	// Initialize the config struct
	config := &models.Config{}

	// Use parameterized query to prevent SQL injection
	query := "SELECT ID, Name, Description, Config, TargetAgent, CreatedAt, UpdatedAt FROM config WHERE ID = ?"
	row := f.db.QueryRow(query, id)

	// Scan the result into the config struct
	err := row.Scan(
		&config.ID,
		&config.Name,
		&config.Description,
		&config.Config,
		&config.TargetAgent,
		&config.CreatedAt,
		&config.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			// If no rows were returned, return a specific error
			log.Printf("No config found with ID: %s", id)
			return nil, errors.New("no config found with ID")
		}
		// Log and return other errors
		log.Printf("Error scanning config with ID %s: %v", id, err)
		return nil, err
	}

	return config, nil
}

func (f *FrontendAgentRepository) GetMetrics(id string) (*models.AgentMetrics, error) {
	// Initialize the agentMetrics struct
	agentMetrics := &models.AgentMetrics{}

	// Use parameterized query to prevent SQL injection
	row := f.db.QueryRow("SELECT AgentID, Status, ExportedDataVolume, UptimeSeconds, DroppedRecords, UpdatedAt FROM agent_metrics WHERE AgentID = ?", id)

	// Scan the result into the agent struct
	err := row.Scan(&agentMetrics.AgentID, &agentMetrics.Status, &agentMetrics.ExportedDataVolume, &agentMetrics.UptimeSeconds, &agentMetrics.DroppedRecords, &agentMetrics.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("no metrics collected yet")
		}
		return nil, err
	}

	return agentMetrics, nil
}
