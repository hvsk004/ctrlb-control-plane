import axiosInstance from '@/lib/axiosInstance';
import { ApiError } from '@/types/agent.types';
import axios, { AxiosError } from 'axios';

const apiUrl = "http://localhost:8096"
const API_BASE_URL = `${apiUrl}/api/frontend/v2`;

const pipelineServices = {
    getAllPipelines: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/pipelines`)
            const data = response.data

            if (!data) {
                console.log("No Pipelines are available.")
            }
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.getAllPipelines()
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch pipelines list")
        }
    },

    getPipelineById: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/pipelines/${id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist.")
            }
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.getPipelineById(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch Pipeline by it's Id.")
        }
    },
    deletePipelineById: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/pipelines/${id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to delete an pipeline.")
            }
            console.log("Agent Deleted successfully")
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.deletePipelineById(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to delete pipeline by it's id")
        }
    },
    getPipelineGraph: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/pipelines/${id}/graph`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to get the graph for the given id of pipeline.")
            }
            console.log("Pipeline graph fetched successfully")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.getPipelineGraph(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to get pipeline graph.")
        }
    },
    syncPipelineGraph: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.post(`/pipelines/${id}/graph`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to sync the graph for the given id of pipeline. ")
            }
            console.log("Pipeline graph synced successfully.")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.syncPipelineGraph(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to sync pipeline graph.")
        }
    },
    getAllAgentsAttachedToPipeline: async (id: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/pipelines/${id}/agents`)
            const data = response.data
            if (!data) {
                console.log("Unable to get all agents connected to the given pipeline by it's id.")
            }
            console.log("fetched all agents connected to the given pipeline by it's id.")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.getAllAgentsAttachedToPipeline(id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch agents connected to the given pipeline by it's id.")
        }
    },
    detachAgentFromPipeline: async (id: string, agent_id: string): Promise<any> => {
        try {
            const response = await axiosInstance.delete(`/pipelines/${id}/agent/${agent_id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to detach agent from the pipeline.")
            }
            console.log("Agent sucCessfully detached from the pipeline.")

        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.detachAgentFromPipeline(id, agent_id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to detach agent from the pipeline.")
        }
    },
    attachAgentToPipeline: async (id: string, agent_id: string): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/pipelines/${id}/agent/${agent_id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to attach an agent to the pipeline.")
            }
            console.log("Agent attached successfully.")
            return data
        } catch (error: any) {
            if (error.response.status === 401) {
                await refreshToken()
                return await pipelineServices.attachAgentToPipeline(id, agent_id)
            }
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to attach an agent to the pipeline.")
        }
    }

}
const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refreshToken')
    const res = await axiosInstance.post(`${apiUrl}/api/auth/v1/refresh`, { refresh_token: refresh_token })
    const newAccessToken = res.data.access_token
    localStorage.setItem('accessToken', newAccessToken)
}


export default pipelineServices