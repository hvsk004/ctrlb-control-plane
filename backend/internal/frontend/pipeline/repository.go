package frontendpipeline

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

type FrontendPipelineRepository struct {
	db *sql.DB
}

func NewFrontendPipelineRepository(db *sql.DB) *FrontendPipelineRepository {
	return &FrontendPipelineRepository{db: db}
}

func (f *FrontendPipelineRepository) GetAllPipelines() ([]Pipeline, error) {
	var pipelines []Pipeline

	rows, err := f.db.Query("SELECT id, name, type, version, hostname, platform, configId, registeredAt FROM agents WHERE isPipeline = true")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var registeredAt sql.NullTime
		var pipeline Pipeline
		err := rows.Scan(&pipeline.ID, &pipeline.Name, &pipeline.Type, &pipeline.Version, &pipeline.Hostname, &pipeline.Platform, &pipeline.ConfigID, &registeredAt)
		if err != nil {
			return nil, err
		}

		if registeredAt.Valid {
			pipeline.RegisteredAt = registeredAt.Time // Assign if valid
		}
		pipelines = append(pipelines, pipeline)
	}
	// Check if there were any errors encountered during the iteration
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pipelines, nil
}

func (f *FrontendPipelineRepository) GetPipeline(id string) (*Pipeline, error) {
	// Initialize the agent struct
	pipeline := &Pipeline{}

	// Use parameterized query to prevent SQL injection
	row := f.db.QueryRow("SELECT id, name, type, version, hostname, platform, configID, isPipeline, registeredAt FROM agents WHERE id = ?", id)

	// Scan the result into the agent struct
	err := row.Scan(&pipeline.ID, &pipeline.Name, &pipeline.Type, &pipeline.Version, &pipeline.Hostname, &pipeline.Platform, &pipeline.ConfigID, &pipeline.IsPipeline, &pipeline.RegisteredAt)
	if err != nil {
		return nil, err
	}

	return pipeline, nil
}

func (f *FrontendPipelineRepository) DeletePipeline(id string) error {
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
		return fmt.Errorf("no pipeline found with id %s", id)
	}

	return nil
}

func (f *FrontendPipelineRepository) GetConfig(id string) (*models.Config, error) {
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

func (f *FrontendPipelineRepository) GetMetrics(id string) (*models.AgentMetrics, error) {
	pipelineMetrics := &models.AgentMetrics{}

	// Use parameterized query to prevent SQL injection
	row := f.db.QueryRow("SELECT AgentID, Status, ExportedDataVolume, UptimeSeconds, DroppedRecords, UpdatedAt FROM agent_metrics WHERE AgentID = ?", id)

	// Scan the result into the agent struct
	err := row.Scan(&pipelineMetrics.AgentID, &pipelineMetrics.Status, &pipelineMetrics.ExportedDataVolume, &pipelineMetrics.UptimeSeconds, &pipelineMetrics.DroppedRecords, &pipelineMetrics.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("no metrics collected yet")
		}
		return nil, err
	}

	return pipelineMetrics, nil
}
