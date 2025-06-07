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

// Listar todos os atendimentos
export const listarAtendimentos = async () => {
    try {
        const response = await api.get('/api/atendimento');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar atendimentos:', error);
        throw error;
    }
};

// Buscar atendimento por ID
export const buscarAtendimento = async (id) => {
    try {
        const response = await api.get(`/api/atendimento/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimento:', error);
        throw error;
    }
};

// Salvar atendimento (criar ou atualizar)
export const salvarAtendimento = async (atendimento) => {
    try {
        const dadosAtendimento = {
            idagendamento: parseInt(atendimento.idagendamento),
            idprofissional: parseInt(atendimento.idprofissional),
            descricao: atendimento.descricao?.trim(),
            data: atendimento.data
        };

        if (atendimento.idatendimento) {
            // Para atualização, incluir o ID no corpo da requisição
            dadosAtendimento.idatendimento = parseInt(atendimento.idatendimento);
            const response = await api.put(`/api/atendimento/${atendimento.idatendimento}`, dadosAtendimento);
            return response.data;
        } else {
            const response = await api.post('/api/atendimento', dadosAtendimento);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar atendimento:', error);
        throw error;
    }
};

// Excluir atendimento
export const excluirAtendimento = async (id) => {
    try {
        await api.delete(`/api/atendimento/${id}`);
    } catch (error) {
        console.error('Erro ao excluir atendimento:', error);
        throw error;
    }
};

export default api;