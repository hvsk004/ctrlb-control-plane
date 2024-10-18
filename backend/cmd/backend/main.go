package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/api"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/auth"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/constants"
	database "github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/db"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/repositories"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/services"
)

func main() {

	constants.WORKER_COUNT = *flag.Int("wc", 4, "Number of worker threads")
	constants.PORT = *flag.String("port", "8096", "Server port for communication")
	constants.ENV = *flag.String("env", "prod", "For testing purpose")

	db, err := database.InitializeDB()
	if err != nil {
		return
	}

	agentQueue := services.NewQueue(constants.WORKER_COUNT)

	basicAuthenticator := auth.NewBasicAuthenticator()

	agentRepository := repositories.NewAgentRepository(db)
	authRepository := repositories.NewAuthRepository(db)
	frontendRepository := repositories.NewFrontendRepository(db)

	agentService := services.NewAgentService(agentRepository, agentQueue)
	authService := services.NewAuthService(authRepository)
	frontendService := services.NewFrontendService(frontendRepository)

	services := services.Services{
		AgentService:    agentService,
		AuthService:     authService,
		FrontendService: frontendService,
	}

	handler := api.NewRouter(&services, &basicAuthenticator)
	server := &http.Server{
		Addr:    ":" + constants.PORT,
		Handler: handler,
	}

	go func() {
		log.Println("Server started on :", constants.PORT)
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start Server:", err)
		}
	}()

	// Wait for an interrupt signal to gracefully shut down the server
	interruptChan := make(chan os.Signal, 1)
	signal.Notify(interruptChan, os.Interrupt, syscall.SIGTERM)
	<-interruptChan
}
