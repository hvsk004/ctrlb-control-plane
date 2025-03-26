import axios from "axios";

const apiUrl = "http://localhost:8096";
const API_BASE_URL = `${apiUrl}/api/frontend/v2`;



const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `${localStorage.getItem('accessToken')}`
    }
});

export default axiosInstance;