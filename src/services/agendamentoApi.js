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

// Listar todos os agendamentos
export const listarAgendamentos = async () => {
    try {
        const response = await api.get('/api/agendamento');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        throw error;
    }
};

// Buscar agendamento por ID
export const buscarAgendamento = async (id) => {
    try {
        const response = await api.get(`/api/agendamento/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamento:', error);
        throw error;
    }
};

// Salvar agendamento (criar ou atualizar)
export const salvarAgendamento = async (agendamento) => {
    try {
        // Preparar dados do agendamento
        const dadosAgendamento = {
            datahorario: agendamento.datahorario,
            descricao: agendamento.descricao?.trim() || null,
            idusuario: agendamento.idusuario ? parseInt(agendamento.idusuario) : null,
            idtratamento: agendamento.idtratamento ? parseInt(agendamento.idtratamento) : null,
            idprofissional: agendamento.idprofissional ? parseInt(agendamento.idprofissional) : null
        };

        // Validações básicas
        if (!dadosAgendamento.datahorario) {
            throw new Error('Data e horário são obrigatórios');
        }

        if (!dadosAgendamento.idusuario) {
            throw new Error('Usuário é obrigatório');
        }

        if (!dadosAgendamento.idprofissional) {
            throw new Error('Profissional é obrigatório');
        }

        // Verificar se é futuro
        const agendamentoData = new Date(dadosAgendamento.datahorario);
        if (agendamentoData <= new Date()) {
            throw new Error('Data do agendamento deve ser futura');
        }

        // Se é edição (tem ID)
        if (agendamento.idagendamento) {
            const response = await api.put(`/api/agendamento/${agendamento.idagendamento}`, dadosAgendamento);
            return response.data;
        } else {
            // Criação
            const response = await api.post('/api/agendamento', dadosAgendamento);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.message) {
            throw error;
        } else {
            throw new Error('Erro desconhecido ao salvar agendamento.');
        }
    }
};

// Excluir agendamento
export const excluirAgendamento = async (id) => {
    try {
        await api.delete(`/api/agendamento/${id}`);
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        throw error;
    }
};

// Buscar agendamentos por usuário
export const buscarAgendamentosPorUsuario = async (idusuario) => {
    try {
        const response = await api.get(`/api/agendamento/usuario/${idusuario}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos por usuário:', error);
        throw error;
    }
};

// Buscar agendamentos por profissional
export const buscarAgendamentosPorProfissional = async (idprofissional) => {
    try {
        const response = await api.get(`/api/agendamento/profissional/${idprofissional}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos por profissional:', error);
        throw error;
    }
};

// Buscar agendamentos por tratamento
export const buscarAgendamentosPorTratamento = async (idtratamento) => {
    try {
        const response = await api.get(`/api/agendamento/tratamento/${idtratamento}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos por tratamento:', error);
        throw error;
    }
};

// Buscar agendamentos por período
export const buscarAgendamentosPorPeriodo = async (inicio, fim) => {
    try {
        const response = await api.get('/api/agendamento/periodo', {
            params: {
                inicio: inicio,
                fim: fim
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos por período:', error);
        throw error;
    }
};

// Buscar agendamentos de hoje
export const buscarAgendamentosHoje = async () => {
    try {
        const response = await api.get('/api/agendamento/hoje');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos de hoje:', error);
        throw error;
    }
};

// Buscar próximos agendamentos
export const buscarProximosAgendamentos = async () => {
    try {
        const response = await api.get('/api/agendamento/proximos');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar próximos agendamentos:', error);
        throw error;
    }
};

// Buscar agendamentos da semana
export const buscarAgendamentosSemana = async (data) => {
    try {
        const response = await api.get('/api/agendamento/semana', {
            params: { data }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos da semana:', error);
        throw error;
    }
};

// Verificar conflito de horário para profissional
export const verificarConflitoProfissional = async (idprofissional, datahorario, idagendamento = null) => {
    try {
        const params = { 
            idprofissional, 
            datahorario
        };
        if (idagendamento) {
            params.idagendamento = idagendamento;
        }
        
        const response = await api.get('/api/agendamento/verificar-conflito', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar conflito:', error);
        throw error;
    }
};

// Contar total de agendamentos
export const contarAgendamentos = async () => {
    try {
        const response = await api.get('/api/agendamento/count');
        return response.data;
    } catch (error) {
        console.error('Erro ao contar agendamentos:', error);
        throw error;
    }
};

// Contar agendamentos por usuário
export const contarAgendamentosPorUsuario = async (idusuario) => {
    try {
        const response = await api.get(`/api/agendamento/count/usuario/${idusuario}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao contar agendamentos por usuário:', error);
        throw error;
    }
};

// Contar agendamentos por profissional
export const contarAgendamentosPorProfissional = async (idprofissional) => {
    try {
        const response = await api.get(`/api/agendamento/count/profissional/${idprofissional}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao contar agendamentos por profissional:', error);
        throw error;
    }
};

// Função para formatar data para o formato ISO (para enviar ao backend)
export const formatarDataParaISO = (data, hora) => {
    if (!data || !hora) return null;
    return `${data}T${hora}:00`;
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

// Função para extrair data do datetime
export const extrairData = (datahorario) => {
    if (!datahorario) return '';
    return datahorario.split('T')[0];
};

// Função para extrair hora do datetime
export const extrairHora = (datahorario) => {
    if (!datahorario) return '';
    const hora = datahorario.split('T')[1];
    return hora ? hora.substring(0, 5) : '';
};

// Buscar profissionais ativos (para agendamentos)
export const listarProfissionaisAtivos = async () => {
    try {
        const response = await api.get('/api/profissional/ativos');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar profissionais ativos:', error);
        throw error;
    }
};

export default api;
