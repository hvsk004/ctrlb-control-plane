package agent

import (
	"database/sql"
	"errors"
	"log"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

// AgentRepository interacts with the agent database.
type AgentRepository struct {
	db *sql.DB // Database connection
}

// NewAgentRepository creates a new AgentRepository.
func NewAgentRepository(db *sql.DB) *AgentRepository {
	return &AgentRepository{db: db}
}

// RegisterAgent registers a new agent in the database.
func (ar *AgentRepository) RegisterAgent(agent *models.AgentWithConfig) error {
	var existingAgent string

	// Check if the agent is already registered
	err := ar.db.QueryRow("SELECT ID FROM agents WHERE Name = ?", agent.Name).Scan(&existingAgent)
	if err == nil {
		log.Printf("Agent already registered: %s", agent.Name)
		return errors.New("agent " + agent.Name + " already exists")
	} else if err != sql.ErrNoRows {
		log.Println(err)
		return errors.New("error checking database: " + err.Error())
	}

	// Insert the new agent into the database
	_, err = ar.db.Exec("INSERT INTO agents (ID, Name, Type, Version, Hostname, Platform, ConfigID, IsPipeline, RegisteredAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		agent.ID, agent.Name, agent.Type, agent.Version, agent.Hostname, agent.Platform, agent.Config.ID, agent.IsPipeline, agent.RegisteredAt)
	if err != nil {
		log.Println(err)
		return errors.New("error adding new agent: " + err.Error())
	}

	log.Println("New agent added:", agent.Name)
	return nil
}

func (f *AgentRepository) GetConfig(id string) (*models.Config, error) {
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
