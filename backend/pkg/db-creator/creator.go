package dbcreator

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func DBCreator() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./backend.db")
	if err != nil {
		return nil, err
	}

	// Create necessary tables
	err = createUserTable(db)
	if err != nil {
		return nil, err
	}

	err = createAgentTable(db)
	if err != nil {
		return nil, err
	}

	err = createAgentMetricsTable(db)
	if err != nil {
		return nil, err
	}

	err = createConfigTable(db)
	if err != nil {
		return nil, err
	}

	err = createAgentStatusTable(db)
	if err != nil {
		return nil, err
	}

	log.Println("Database and tables created/verified successfully")

	// Return the open *sql.DB connection
	return db, nil
}

func createUserTable(db *sql.DB) error {
	// Create user table
	createUserTableSQL := `CREATE TABLE IF NOT EXISTS user (
		"Email" TEXT PRIMARY KEY,       -- Unique email address for the user (acts as the primary key)
		"Name" TEXT,                    -- Name of the user
		"Password" TEXT                 -- Hashed password for authentication
	);`
	_, err := db.Exec(createUserTableSQL)
	if err != nil {
		log.Printf("Error creating User table: %s", err)
		return err
	}
	return nil
}

func createAgentTable(db *sql.DB) error {
	// Create agents table
	createAgentTableSQL := `CREATE TABLE IF NOT EXISTS agents (
		"ID" TEXT PRIMARY KEY,          -- Unique identifier for the agent
		"Name" TEXT,                    -- Name of the agent
		"Type" TEXT,                    -- Type or category of the agent
		"Version" TEXT,                 -- Version of the agent software
		"Hostname" TEXT,                -- Hostname of the system where the agent is running
		"Platform" TEXT,                -- Platform/OS (e.g., Linux, Windows) on which the agent is running
		"ConfigID" TEXT,                -- Foreign key to reference the associated configuration
		"IsPipeline" BOOL,              -- Boolean indicating whether the agent is part of a pipeline
		"RegisteredAt" DATETIME         -- Timestamp when the agent was first registered
	);`
	_, err := db.Exec(createAgentTableSQL)
	if err != nil {
		log.Printf("Error creating Agent table: %s", err)
		return err
	}
	return nil
}

func createAgentMetricsTable(db *sql.DB) error {
	// Create agent_info table
	createAgentInfoTableSQL := `CREATE TABLE IF NOT EXISTS agent_metrics (
		"AgentID" TEXT PRIMARY KEY,     -- Unique identifier for the agent (linked to agents table)
		"Status" TEXT,                  -- Current status of the agent (e.g., running, stopped)
		"ExportedDataVolume" INTEGER,   -- Volume of data exported by the agent (in MB/GB)
		"Uptime" INTEGER,               -- Uptime of the agent (in seconds)
		"DroppedRecords" INTEGER,       -- Number of records dropped by the agent due to errors
		"UpdatedAt" DATETIME            -- Timestamp when the last status update was recorded
	);`
	_, err := db.Exec(createAgentInfoTableSQL)
	if err != nil {
		log.Printf("Error creating AgentMetrics table: %s", err)
		return err
	}
	return nil
}

func createConfigTable(db *sql.DB) error {
	// Create config table
	createConfigTableSQL := `CREATE TABLE IF NOT EXISTS config (
		"ID" TEXT PRIMARY KEY,          -- Unique identifier for the config
		"Description" TEXT,             -- Brief description of the configuration
		"Config" TEXT,                  -- Actual configuration data (e.g., in JSON or YAML format)
		"TargetAgent" TEXT,             -- Type of agent that this config is designed for
		"CreatedAt" DATETIME,           -- Timestamp when the config was first created
		"UpdatedAt" DATETIME            -- Timestamp when the config was last updated
	);`
	_, err := db.Exec(createConfigTableSQL)
	if err != nil {
		log.Printf("Error creating Config table: %s", err)
		return err
	}
	return nil
}

func createAgentStatusTable(db *sql.DB) error {
	// Create agent_status table
	createAgentStatusTableSQL := `CREATE TABLE IF NOT EXISTS agent_status (
		"AgentID" TEXT PRIMARY KEY,     -- Unique identifier for the agent (linked to agents table)
		"Hostname" TEXT,                -- Hostname of the system where the agent is running
		"CurrentStatus" TEXT,           -- Current status of the agent (e.g., running, stopped)
		"RetryRemaining" INTEGER,       -- Number of retry attempts left before task failure
		"UpdatedAt" DATETIME            -- Timestamp when the last status update was recorded
	);`
	_, err := db.Exec(createAgentStatusTableSQL)
	if err != nil {
		log.Printf("Error creating AgentStatus table: %s", err)
		return err
	}
	return nil
}
