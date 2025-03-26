import axiosInstance from '@/lib/axiosInstance';
import { ApiError } from '@/types/agent.types';
import { AxiosError } from 'axios';

const apiUrl = "http://localhost:8096"

const agentServices = {
    getAllAgents: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get("/agents")
            const data = response.data
            console.log(data)
            if (!data) {
                console.log("No Agents are available.")
            }
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.getAllAgents()
            }
            console.log(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch agent list")
        }
    },

    getAgentById: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/agents/${id}`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist.")
            }
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.getAgentById(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch agent by its Id.")
        }
    },

    deleteAgentById: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.delete(`/agents/${id}`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to delete an agent.")
            }
            console.log("Agent Deleted successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.deleteAgentById(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to delete agent by its id")
        }
    },

    startAgentById: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.post(`/agents/${id}/start`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to start an agent.")
            }
            console.log("Agent Started successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.startAgentById(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to start agent by its id")
        }
    },

    stopAgentById: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.post(`/agents/${id}/stop`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to stop an agent.")
            }
            console.log("Agent Stopped successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.stopAgentById(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to stop agent by its id")
        }
    },

    restartAgentMonitoring: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.post(`/agents/${id}/restart-monitoring`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to restart agent monitoring.")
            }
            console.log("Agent Monitoring Restarted successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.restartAgentMonitoring(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to restart monitoring of the agent")
        }
    },

    getAgentHealthMetrics: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/agents/${id}/healthmetrics`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to get health metrics.")
            }
            console.log("Agent Health Metrics Retrieved successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.getAgentHealthMetrics(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to get health metrics of the agent")
        }
    },
    getAgentRateMetrics: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/agents/${id}/ratemetrics`)
            const data = response.data
            if (!data) {
                console.log("Agent doesn't exist or unable to get rate metrics.")
            }
            console.log("Agent Rate Metrics Retrieved successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await agentServices.getAgentRateMetrics(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to get Rate metrics of the agent")
        }
    },
    addAgentLabel: async (id: string, label: { [key: string]: string }): Promise<any> => {
        try {
            const response = await axiosInstance.post(`/agents/${id}/labels`, label);
            const data = response.data;
            if (!data) {
                console.log("Failed to add label.");
            }
            return data;
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken();
                return await agentServices.addAgentLabel(id, label);
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to add label");
        }
    },
}

const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refreshToken')
    const res = await axiosInstance.post(`${apiUrl}/api/auth/v1/refresh`, { refresh_token: refresh_token })
    const newAccessToken = res.data.access_token
    localStorage.setItem('accessToken', newAccessToken)
}


export default agentServices