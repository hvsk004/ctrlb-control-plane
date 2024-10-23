package agentcomm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"
	"runtime"

	"github.com/ctrlb-hq/ctrlb-collector/internal/constants"
	"github.com/ctrlb-hq/ctrlb-collector/internal/utils"
)

func InformBackendServerStart() error {
	// Step 1: Get hostname or fallback to IP
	hostname, err := os.Hostname()
	if err != nil {
		return fmt.Errorf("failed to get hostname: %v", err)
	}

	// Check if the hostname resolves to a valid DNS entry
	if _, err = net.LookupHost(hostname); err != nil {
		// If DNS resolution fails, fallback to IP address
		hostname, err = utils.GetLocalIP()
		if err != nil {
			return fmt.Errorf("failed to get IP address: %v", err)
		}
	}

	// Step 2: Gather platform information
	platform := fmt.Sprintf("%s/%s", runtime.GOOS, runtime.GOARCH)

	// Step 3: Create the agent request
	agentRequest := AgentRequest{
		Type:       constants.AGENT_TYPE,
		Version:    constants.AGENT_VERSION,
		Platform:   platform,
		Hostname:   hostname,
		IsPipeline: constants.IS_PIPELINE,
	}

	// Step 4: Marshal the agent request into JSON
	requestBody, err := json.Marshal(agentRequest)
	if err != nil {
		return fmt.Errorf("failed to marshal agent request: %v", err)
	}

	// Step 5: Create the HTTP request to inform the backend server
	url := fmt.Sprintf("http://%s/api/v1/agent/register", constants.BACKEND_URL)
	req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(requestBody))
	if err != nil {
		return fmt.Errorf("error creating HTTP request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")

	// Step 6: Execute the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error sending HTTP request: %v", err)
	}
	defer resp.Body.Close()

	// Step 7: Check the response status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected response status: %d %s", resp.StatusCode, http.StatusText(resp.StatusCode))
	}

	return nil
}
