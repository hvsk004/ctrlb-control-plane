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
func (ar *AgentRepository) RegisterAgent(agent *models.Agent) error {
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
		agent.ID, agent.Name, agent.Type, agent.Version, agent.Hostname, agent.Platform, agent.ConfigID, agent.IsPipeline, agent.RegisteredAt)
	if err != nil {
		log.Println(err)
		return errors.New("error adding new agent: " + err.Error())
	}

	log.Println("New agent added:", agent.Name)
	return nil
}
