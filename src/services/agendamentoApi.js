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

// Listar todos os profissionais
export const listarProfissionais = async () => {
    try {
        const response = await api.get('/api/profissional');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar profissionais:', error);
        throw error;
    }
};

// Buscar profissional por ID
export const buscarProfissional = async (id) => {
    try {
        const response = await api.get(`/api/profissional/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar profissional:', error);
        throw error;
    }
};

// Salvar profissional (criar ou atualizar)
export const salvarProfissional = async (profissional) => {
    try {
        const dadosProfissional = {
            idusuario: parseInt(profissional.idusuario),
            especialidade: profissional.especialidade?.trim(),
            cro: profissional.cro?.trim(),
            estadocro: profissional.estadocro?.trim(),
            ativo: parseInt(profissional.ativo)
        };

        if (profissional.idprofissional) {
            const response = await api.put(`/api/profissional/${profissional.idprofissional}`, dadosProfissional);
            return response.data;
        } else {
            const response = await api.post('/api/profissional', dadosProfissional);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar profissional:', error);
        throw error;
    }
};

// Excluir profissional
export const excluirProfissional = async (id) => {
    try {
        await api.delete(`/api/profissional/${id}`);
    } catch (error) {
        console.error('Erro ao excluir profissional:', error);
        throw error;
    }
};

export default api;
