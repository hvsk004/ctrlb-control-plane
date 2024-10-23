package auth

import (
	"encoding/base64"
	"fmt"
)

type BasicAuthenticator struct {
}

func NewBasicAuthenticator() BasicAuthenticator {
	return BasicAuthenticator{}
}

func (a *BasicAuthenticator) GenerateToken(username, password string) string {
	// Combine username and password with colon separator
	auth := fmt.Sprintf("%s:%s", username, password)

	// Base64 encode the result
	return base64.StdEncoding.EncodeToString([]byte(auth))
}
func (a *BasicAuthenticator) ValidateToken(token string) error {
	//TODO: Add logic
	return nil
}
