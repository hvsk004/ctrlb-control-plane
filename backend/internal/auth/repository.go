package auth

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/utils"
)

type AuthRepository struct {
	db *sql.DB
}

func NewAuthRepository(db *sql.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (a *AuthRepository) RegisterUser(user User) (*int64, error) {
	// Use transaction to handle user creation
	tx, err := a.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Attempt to insert user
	res, err := tx.Exec("INSERT INTO user (email, name, password, role) VALUES (?, ?, ?,?)", user.Email, user.Name, user.Password, user.Role)
	if err != nil {
		if utils.IsUniqueViolation(err) {
			return nil, utils.ErrUserAlreadyExists
		}
		return nil, fmt.Errorf("failed to register user: %w", err)
	}

	userID, err := res.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get last insert ID: %w", err)
	}
	// Commit transaction
	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return &userID, nil
}

func (a *AuthRepository) Login(email string) (*User, error) {
	var user User

	query := `SELECT id, email, name, password FROM user WHERE email = ?`
	err := a.db.QueryRow(query, email).Scan(&user.ID, &user.Email, &user.Name, &user.Password)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to query user: %w", err)
	}

	return &user, nil
}

func (a *AuthRepository) UserExists(email string) bool {
	var count int
	query := `SELECT COUNT(*) FROM user WHERE email = ?`

	err := a.db.QueryRow(query, email).Scan(&count)
	if err != nil {
		return false
	}
	return count > 0
}
