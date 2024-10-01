# CTRLB Control Plane for Managing Agents
This repository provides a control plane system designed to manage various agents. Currently, the system supports the configuration and management of Fluent Bit agents. The repository is divided into three main components:

- **Frontend**: The user interface to interact with the control plane, built with React.
- **Backend**: The core logic and API, written in Go, to manage agents and configurations.
- **Agent**: The agent component that builds a wrapper on top of Fluent Bit to manage Fluent Bit instances on the target systems.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Managing Fluent Bit Agents](#managing-fluent-bit-agents)
  - [Agent Communication](#agent-communication)
- [Folder Structure](#folder-structure)
- [Assumptions](#assumptions)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Fluent Bit agent support**: Manage, configure, and monitor Fluent Bit agents.
- **Scalable Control Plane**: Designed to scale as the number of agents increases.
- **Frontend**: A user-friendly React-based web interface for managing agents and configurations.
- **Backend API**: RESTful API, written in Go, for agent control and configuration management.
- **Real-time Monitoring**: View real-time stats from the Fluent Bit agents.

## Architecture
The control plane is structured in a client-server model, where:
- **Frontend**: Provides a web-based interface built using React for users to interact with the control plane.
- **Backend**: Contains the business logic and API, written in Go, for controlling agents and handling configurations.
- **Agent**: Builds a single binary that manages Fluent Bit instances on the target systems.

## Setup

### Prerequisites
- **Node.js** (for the frontend, built with React)
- **Go** (for building the backend)
- **Docker** (optional, for containerized deployment)

> Note: Fluent Bit installation is not required. The agent component builds a Fluent Bit binary that will be deployed as part of the agent setup.

### Installation

#### Backend
1. Navigate to the backend folder:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    go mod tidy
    ```
3. Build and run the backend:
    ```bash
    go build -o control-plane-backend
    ./control-plane-backend
    ```

#### Frontend
1. Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2. Install frontend dependencies:
    ```bash
    npm install
    ```
3. Start the frontend development server:
    ```bash
    npm run dev
    ```

#### Agent
1. Navigate to the agent folder:
    ```bash
    cd agent
    ```
2. Build the Fluent Bit binary and agent:
    ```bash
    ./build.sh
    ```
3. Deploy the agent binary to the target system where Fluent Bit needs to be managed.

### Configuration
- Configure Agent settings through the control plane dashboard via the frontend.
- Ensure that the agents are properly registered with the backend to receive configuration updates.


TODO: To be added
## Usage

### Managing Fluent Bit Agents

### Agent Communication

## Folder Structure


