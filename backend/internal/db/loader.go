package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/fs"
	"strings"
)

func LoadSchemasFromDirectory(db *sql.DB, schemasFS fs.FS, typeMapping map[string]string, signalMapping map[string][]string) error {
	files, err := fs.ReadDir(schemasFS, ".")
	if err != nil {
		return fmt.Errorf("failed to read schema directory: %w", err)
	}

	insertQuery := `
	INSERT OR IGNORE INTO component_schemas (
		name, type, display_name, supported_signals, schema_json
	) VALUES (?, ?, ?, ?, ?);
	`

	for _, file := range files {
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") {
			continue
		}

		name := strings.TrimSuffix(file.Name(), ".json")

		// Read from embedded FS
		schemaBytes, err := fs.ReadFile(schemasFS, file.Name())
		if err != nil {
			return fmt.Errorf("failed to read file %s: %w", file.Name(), err)
		}

		var schemaMap map[string]any
		if err := json.Unmarshal(schemaBytes, &schemaMap); err != nil {
			return fmt.Errorf("invalid JSON in %s: %w", file.Name(), err)
		}

		displayName := name
		if title, ok := schemaMap["title"].(string); ok && title != "" {
			displayName = title
		}

		componentType := typeMapping[name]
		signals := signalMapping[name]
		signalStr := strings.Join(signals, ",")

		_, err = db.Exec(insertQuery, name, componentType, displayName, signalStr, string(schemaBytes))
		if err != nil {
			return fmt.Errorf("failed to insert schema for %s: %w", name, err)
		}
	}

	return nil
}
