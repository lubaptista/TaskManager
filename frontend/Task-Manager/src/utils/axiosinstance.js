import axios from "axios";
import {BASE_URL} from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
});

// Interceptor de requisições
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador de respostas
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //Lidando com erros globais comuns
        if (error.response) {
            if (error.response.status === 401) {
                // Redireciona para a página de login
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Erro no servidor. Por favor, tente novamente mais tarde.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Tempo limite da solicitação atingido. Por favor, tente novamente mais tarde.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;