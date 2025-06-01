import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

// Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const listarClientes = async () => {
    try {
        const response = await api.get('/api/clientes');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        throw error;
    }
};

export const buscarCliente = async (id) => {
    try {
        const response = await api.get(`/api/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        throw error;
    }
};

export const salvarCliente = async (cliente) => {
    try {
        if (cliente.id) {
            const response = await api.put(`/api/clientes/${cliente.id}`, cliente);
            return response.data;
        } else {
            const response = await api.post('/api/clientes', cliente);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        throw error;
    }
};

export const excluirCliente = async (id) => {
    try {
        await api.delete(`/api/clientes/${id}`);
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        throw error;
    }
};

export default api;