package utils

import (
	"errors"
	"net/http"
	"strings"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
)

func ValidateUserRegistrationRequest(request *models.UserRegisterRequest) error {
	if request.Name == "" {
		return errors.New("name cannot be empty")
	}
	if request.Email == "" {
		return errors.New("email cannot be empty")
	}
	if request.Password == "" {
		return errors.New("password cannot be empty")
	}
	return nil
}

func ExtractTokenFromHeaders(headers *http.Header) (string, error) {
	// Extract the JWT token from the request header
	tokenString := headers.Get("Authorization")
	if tokenString == "" {
		return "", errors.New("no token found")
	}

	tokenString = strings.Replace(tokenString, "Basic ", "", 1)
	return tokenString, nil
	// Extract the token from the "Bearer" prefix
}
