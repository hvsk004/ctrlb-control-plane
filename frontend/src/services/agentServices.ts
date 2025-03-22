import { ApiError } from '@/types/agent.types';
import axios, { AxiosError } from 'axios';

const apiUrl = "http://localhost:8096"
const API_BASE_URL = `${apiUrl}/api/frontend/v2`;

const agentServices = {
    getAllAgents: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/agents`)
            const data = response.data

            if (!data) {
                console.log("No Agents are available.")
            }
            return data
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch agent list")
        }
    },

    getAgentById: async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/agents/${id}`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist.")
            }
            return data
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch agent by it's Id.")
        }
    },
    deleteAgentById: async (id: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/agents/${id}`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to delete an agent.")
            }
            console.log("Agent Deleted sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to delete agent by it's id")
        }
    },
    startAgentById: async (id: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/agents/${id}/start`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to start an agent.")
            }
            console.log("Agent Started sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to start agent by it's id")
        }
    },
    stopAgentById: async (id: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/agents/${id}/stop`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to stop an agent.")
            }
            console.log("Agent Stopped sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to stop agent by it's id")
        }
    },
    restartAgentMonitoring: async (id: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/agents/${id}/restart-monitoring`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to restart agent monitoring.")
            }
            console.log("Agent Monitoring Restarted sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to restart monitoring of the agent")
        }
    },
    getAgentHealthMetrics: async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/agents/${id}/healthmetrics`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to get health metrics.")
            }
            console.log("Agent Health Metrics Retrieved sucessfully")

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to get health metrics of the agent")
        }
    },
    getAgentRateMetrics: async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/agents/${id}/ratemetrics`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to get rate metrics.")
            }
            console.log("Agent Rate Metrics Retrieved sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to get rate metrics of the agent")
        }
    }

}


export default agentServices