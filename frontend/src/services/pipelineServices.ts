import { ApiError } from '@/types/agent.types';
import axios, { AxiosError } from 'axios';

const apiUrl = "http://localhost:8096"
const API_BASE_URL = `${apiUrl}/api/frontend/v2`;

const pipelineServices = {
    getAllPipelines: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pipelines`)
            const data = response.data

            if (!data) {
                console.log("No Pipelines are available.")
            }
            return data
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch pipelines list")
        }
    },

    getPipelineById: async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pipelines/${id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist.")
            }
            return data
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch Pipeline by it's Id.")
        }
    },
    deletePipelineById: async (id: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/pipelines/${id}`)
            const data = response.data
            if (!data) {
                console.log("Pipleine doesn't exist or unable to delete an pipeline.")
            }
            console.log("Agent Deleted sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to delete pipeline by it's id")
        }
    },
    getPipelineGraph: async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pipelines/${id}/graph`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to get the graph for the given id of pipeline.")
            }
            console.log("Pipeline graph fecthed sucessfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to get pipeline graph.")
        }
    },
    syncPipelineGraph: async (id: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/pipelines/${id}/graph`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to sync the graph for the given id of pipeline. ")
            }
            console.log("Pipeline graph synced sucessfully.")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to sync pipeline graph.")
        }
    },
    getAllAgentsAttachedToPipeline: async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pipelines/${id}/agents`)
            const data = response.data
            if (!data) {
                console.log("Unable to get all agents connected to the given pipeline by it's id.")
            }
            console.log("fetched all agents connected to the given pipeline by it's id.")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to fetch agents connected to the given pipeline by it's id.")
        }
    },
    detachAgentFromPipeline: async (id: string,agent_id:string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/pipelines/${id}/agent/${agent_id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to detach agent from the pipeline.")
            }
            console.log("Agent sucessfully detached from the pipeline.")

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to detach agent from the pipeline.")
        }
    },
    attachAgentToPipeline: async (id: string,agent_id:string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/pipelines/${id}/agent/${agent_id}`)
            const data = response.data
            if (!data) {
                console.log("Pipeline doesn't exist or unable to attach an agent to the pipeline.")
            }
            console.log("Agent attached sucessfully.")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data.message || "Failed to attach an agent to the pipeline.")
        }
    }

}


export default pipelineServices