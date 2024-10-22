package database

import (
	"database/sql"
)

func InitializeDB() (*sql.DB, error) {
	db, err := dbCreator()
	if err != nil {
		return nil, err
	}
	err = createDefaultConfig(db)
	if err != nil {
		return nil, err
	}
	return db, nil
}
