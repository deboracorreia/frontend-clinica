import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Listar todos os tratamentos
export const listarTratamentos = async () => {
    try {
        const response = await api.get('/api/tratamento');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar tratamentos:', error);
        throw error;
    }
};

// Buscar tratamento por ID
export const buscarTratamento = async (id) => {
    try {
        const response = await api.get(`/api/tratamento/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tratamento:', error);
        throw error;
    }
};

// Salvar tratamento (criar ou atualizar)
export const salvarTratamento = async (tratamento) => {
    try {
        const dadosTratamento = {
            nometratamento: tratamento.nometratamento?.trim()
        };

        if (tratamento.idtratamento) {
            const response = await api.put(`/api/tratamento/${tratamento.idtratamento}`, dadosTratamento);
            return response.data;
        } else {
            const response = await api.post('/api/tratamento', dadosTratamento);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar tratamento:', error);
        throw error;
    }
};

// Excluir tratamento
export const excluirTratamento = async (id) => {
    try {
        await api.delete(`/api/tratamento/${id}`);
    } catch (error) {
        console.error('Erro ao excluir tratamento:', error);
        throw error;
    }
};

export default api;