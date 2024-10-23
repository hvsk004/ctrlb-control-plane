package queue

import (
	"net/http"
	"time"
)

// NewQueue creates a new AgentQueue with the specified number of workers.
func NewQueue(workerCount int) *AgentQueue {
	q := &AgentQueue{
		agents:      make(map[string]*AgentStatus),
		checkQueue:  make(chan string, workerCount*2),
		workerCount: workerCount,
	}
	q.startWorkers()
	return q
}

// AddAgent adds a new agent to the queue.
func (q *AgentQueue) AddAgent(ID, Hostname string) {
	q.mutex.Lock()
	defer q.mutex.Unlock()
	q.agents[ID] = &AgentStatus{
		AgentID:        ID,
		Hostname:       Hostname,
		CurrentStatus:  "UNKNOWN",
		RetryRemaining: 3,
	}
}

// RemoveAgent removes an agent from the queue by ID.
func (q *AgentQueue) RemoveAgent(id string) {
	q.mutex.Lock()
	defer q.mutex.Unlock()
	delete(q.agents, id)
}

// StartStatusCheck starts a goroutine that checks the status of all agents at regular intervals.
func (q *AgentQueue) StartStatusCheck() {
	ticker := time.NewTicker(1 * time.Minute)
	go func() {
		for range ticker.C {
			q.checkAllAgents()
		}
	}()
}

//FIXME: See if this shutsdown if receieves closing signal

// Internal methods

func (q *AgentQueue) checkAllAgents() {
	q.mutex.RLock()
	agentIDs := make([]string, 0, len(q.agents))
	for id := range q.agents {
		agentIDs = append(agentIDs, id)
	}
	q.mutex.RUnlock()

	for _, id := range agentIDs {
		q.checkQueue <- id
	}
}

func (q *AgentQueue) startWorkers() {
	for i := 0; i < q.workerCount; i++ {
		go q.worker()
	}
}

func (q *AgentQueue) worker() {
	for agentID := range q.checkQueue {
		q.mutex.RLock()
		agent, exists := q.agents[agentID]
		q.mutex.RUnlock()

		if exists {
			q.checkAgentStatus(agent)
		}
	}
}

func (q *AgentQueue) checkAgentStatus(agentStatus *AgentStatus) {
	client := &http.Client{Timeout: 2 * time.Second}
	resp, err := client.Get(agentStatus.Hostname + ":443" + "/agent/v1/status")

	q.mutex.Lock()
	defer q.mutex.Unlock()

	if err != nil {
		agentStatus.RetryRemaining--
		if agentStatus.RetryRemaining <= 0 {
			agentStatus.CurrentStatus = "DOWN"
			// TODO: Update DB and remove agent from Queue
		} else {
			// TODO: Update DB
			agentStatus.CurrentStatus = "UNKNOWN"
		}
	} else {
		defer resp.Body.Close()
		if resp.StatusCode == http.StatusOK {
			if agentStatus.CurrentStatus != "UP" {
				// TODO: Update DB
			}
			agentStatus.CurrentStatus = "UP"
			agentStatus.RetryRemaining = 3
		} else {
			// TODO: Update DB
			agentStatus.CurrentStatus = "UNKNOWN"
			agentStatus.RetryRemaining--
		}
	}
}
