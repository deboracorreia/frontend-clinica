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

// Listar todos os tratamentos
export const listarTratamentos = async () => {
    try {
        const response = await api.get('/api/tratamentos');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar tratamentos:', error);
        throw error;
    }
};

// Buscar tratamento por ID
export const buscarTratamento = async (id) => {
    try {
        const response = await api.get(`/api/tratamentos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tratamento:', error);
        throw error;
    }
};

// Buscar tratamentos por nome
export const buscarTratamentosPorNome = async (nome) => {
    try {
        const response = await api.get(`/api/tratamentos/nome/${nome}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tratamentos por nome:', error);
        throw error;
    }
};

// Salvar tratamento (criar ou atualizar)
export const salvarTratamento = async (tratamento) => {
    try {
        // Preparar dados do tratamento
        const dadosTratamento = {
            nometratamento: tratamento.nometratamento?.trim()
        };

        // Validações básicas
        if (!dadosTratamento.nometratamento || dadosTratamento.nometratamento.length < 2) {
            throw new Error('Nome do tratamento é obrigatório e deve ter pelo menos 2 caracteres');
        }

        if (dadosTratamento.nometratamento.length > 100) {
            throw new Error('Nome do tratamento deve ter no máximo 100 caracteres');
        }

        // Se é edição (tem ID)
        if (tratamento.idtratamento) {
            const response = await api.put(`/api/tratamentos/${tratamento.idtratamento}`, dadosTratamento);
            return response.data;
        } else {
            // Criação
            const response = await api.post('/api/tratamentos', dadosTratamento);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar tratamento:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Erro desconhecido ao salvar tratamento.');
        }
    }
};

// Excluir tratamento
export const excluirTratamento = async (id) => {
    try {
        await api.delete(`/api/tratamentos/${id}`);
    } catch (error) {
        console.error('Erro ao excluir tratamento:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Erro ao excluir tratamento. Verifique se não há registros vinculados.');
        }
    }
};

// Verificar se nome do tratamento já existe
export const verificarNomeTratamentoExistente = async (nome, idTratamentoAtual = null) => {
    try {
        const nomeFormatado = nome.trim();
        const params = { nome: nomeFormatado };
        if (idTratamentoAtual) {
            params.excludeId = idTratamentoAtual;
        }
        
        const response = await api.get('/api/tratamentos/verificar-nome', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar nome do tratamento:', error);
        throw error;
    }
};

// Contar total de tratamentos
export const contarTratamentos = async () => {
    try {
        const response = await api.get('/api/tratamentos/count');
        return response.data;
    } catch (error) {
        console.error('Erro ao contar tratamentos:', error);
        throw error;
    }
};

// Listar tratamentos ordenados alfabeticamente
export const listarTratamentosOrdenados = async () => {
    try {
        const response = await api.get('/api/tratamentos/ordenados');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar tratamentos ordenados:', error);
        throw error;
    }
};

// Buscar tratamentos ativos (se houver controle de status)
export const listarTratamentosAtivos = async () => {
    try {
        const response = await api.get('/api/tratamentos/ativos');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar tratamentos ativos:', error);
        throw error;
    }
};

export default api;