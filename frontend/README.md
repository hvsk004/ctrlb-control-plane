# Frontend Application Overview

This README provides an overview of the folder structure and key components of the frontend application.

## Folder Structure

### `src/`
Contains the main source code for the application.

- **`components/: Reusable UI components that are used throughout the application.
     - Agents: Contains all the components that are used to display the agents (Including AgentsTable, landing page for Agents, and Charts for CPU/Memory Usage and Metrics for agents) and creating of agents.
     - Components/CanvasForPipelines: Contains all the components that are used for visualization of pipelines, including source,processor and destination Nodes.
     - Pipelines: Contains all the components that are used displaying the list of pipelines and information about each pipeline.
     - Pipelines/AddNewPipelineComponent: Contains all the components that are used for the creation of pipelines including the addition of pipeline information, source and destination nodes and adding an agent to the pipeline.
     - Pipelines/DropdownOptions: Contains all the options that will be available to the user for selecting the type for the source,destination and processor.
- **`services/`**: Contains all the services for pipeline and agents.
- **`constants/`**: Holds constant values used across the application to maintain consistency.
- **`types/`**: Type definitions for TypeScript, ensuring type safety in the application.
- **`hooks/`**: Custom React hooks that encapsulate reusable logic.
- **`lib/`**: Utility functions and libraries that support the application.
- **`pages/`**: Contains login and signup pages

### `public/`
Static assets such as images and icons that are served directly.

### Configuration Files
- **`vite.config.ts`**: Configuration for the Vite build tool, including server settings and path aliases.
- **`package.json`**: Lists the dependencies and scripts for the project.
- **`index.html`**: The main HTML file that serves as the entry point for the application.

## How to Run
To set up and run the frontend application, follow these steps:
1. Install dependencies: `npm install --legacy-peer-deps`
2. Start the development server: `npm run dev`
3. Open your browser and navigate to `http://localhost:3030` to view the application.

This README serves as a guide to understanding the structure and setup of the frontend application.
