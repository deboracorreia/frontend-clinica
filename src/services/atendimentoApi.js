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
        // Preparar dados do atendimento
        const dadosAtendimento = {
            idagendamento: atendimento.idagendamento ? parseInt(atendimento.idagendamento) : null,
            descricao: atendimento.descricao?.trim(),
            data: atendimento.data || new Date().toISOString(),
            status: atendimento.status
        };

        // Validações básicas
        if (!dadosAtendimento.idagendamento) {
            throw new Error('Agendamento é obrigatório');
        }

        if (!dadosAtendimento.descricao || dadosAtendimento.descricao.length < 10) {
            throw new Error('Descrição deve ter pelo menos 10 caracteres');
        }

        if (!dadosAtendimento.status) {
            throw new Error('Status do atendimento é obrigatório');
        }

        // Se é edição (tem ID)
        if (atendimento.idatendimento) {
            const response = await api.put(`/api/atendimento/${atendimento.idatendimento}`, dadosAtendimento);
            return response.data;
        } else {
            // Criação
            const response = await api.post('/api/atendimento', dadosAtendimento);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar atendimento:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.message) {
            throw error;
        } else {
            throw new Error('Erro desconhecido ao salvar atendimento.');
        }
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

// Buscar atendimentos por status
export const buscarAtendimentosPorStatus = async (status) => {
    try {
        const response = await api.get(`/api/atendimento/status/${status}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimentos por status:', error);
        throw error;
    }
};

// Buscar atendimentos por usuário
export const buscarAtendimentosPorUsuario = async (idusuario) => {
    try {
        const response = await api.get(`/api/atendimento/usuario/${idusuario}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimentos por usuário:', error);
        throw error;
    }
};

// Buscar atendimentos por profissional
export const buscarAtendimentosPorProfissional = async (idprofissional) => {
    try {
        const response = await api.get(`/api/atendimento/profissional/${idprofissional}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimentos por profissional:', error);
        throw error;
    }
};

// Buscar atendimentos por status e usuário
export const buscarAtendimentosPorStatusEUsuario = async (status, idusuario) => {
    try {
        const response = await api.get(`/api/atendimento/status/${status}/usuario/${idusuario}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimentos por status e usuário:', error);
        throw error;
    }
};

// Buscar atendimento por agendamento
export const buscarAtendimentoPorAgendamento = async (idagendamento) => {
    try {
        const response = await api.get(`/api/atendimento/agendamento/${idagendamento}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimento por agendamento:', error);
        throw error;
    }
};

// Verificar se existe atendimento para agendamento
export const existeAtendimentoParaAgendamento = async (idagendamento) => {
    try {
        const response = await api.get(`/api/atendimento/existe-para-agendamento/${idagendamento}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar atendimento:', error);
        throw error;
    }
};

// Buscar atendimentos de hoje
export const buscarAtendimentosHoje = async () => {
    try {
        const response = await api.get('/api/atendimento/hoje');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atendimentos de hoje:', error);
        throw error;
    }
};

// Contar total de atendimentos
export const contarAtendimentos = async () => {
    try {
        const response = await api.get('/api/atendimento/count');
        return response.data;
    } catch (error) {
        console.error('Erro ao contar atendimentos:', error);
        throw error;
    }
};

// Contar atendimentos por status
export const contarAtendimentosPorStatus = async (status) => {
    try {
        const response = await api.get(`/api/atendimento/count/status/${status}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao contar atendimentos por status:', error);
        throw error;
    }
};

// Status disponíveis
export const STATUS_ATENDIMENTO = {
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    CANCELADO: 'CANCELADO',
    CONCLUIDO: 'CONCLUIDO'
};

// Função para formatar status para exibição
export const formatarStatus = (status) => {
    const statusMap = {
        'EM_ANDAMENTO': 'Em Andamento',
        'CANCELADO': 'Cancelado',
        'CONCLUIDO': 'Concluído'
    };
    return statusMap[status] || status;
};

// Função para obter cor do status
export const getCorStatus = (status) => {
    const coresMap = {
        'EM_ANDAMENTO': '#ffc107', // Amarelo
        'CANCELADO': '#dc3545',    // Vermelho
        'CONCLUIDO': '#28a745'     // Verde
    };
    return coresMap[status] || '#6c757d';
};

// Função para formatar data e hora para exibição
export const formatarDataHorario = (datahorario) => {
    if (!datahorario) return '';
    
    const data = new Date(datahorario);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default api;