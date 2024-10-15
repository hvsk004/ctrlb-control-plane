package handler

import (
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/services"
)

type AgentHandler struct {
	AgentService       *services.AgentService
	BasicAuthenticator *auth.BasicAuthenticator
}

type AuthHandler struct {
	AuthService        *services.AuthService
	BasicAuthenticator *auth.BasicAuthenticator
}

type FrontendHandler struct {
	FrontendService    *services.FrontendService
	BasicAuthenticator *auth.BasicAuthenticator
}
