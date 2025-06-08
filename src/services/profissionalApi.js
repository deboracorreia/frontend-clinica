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
            idusuario: profissional.idusuario ? parseInt(profissional.idusuario) : null,
            especialidade: profissional.especialidade?.trim(),
            cro: profissional.cro?.trim(),
            estadocro: profissional.estadocro?.trim(),
            ativo: profissional.ativo // <<<< REMOVIDO parseInt - agora envia boolean direto
        };

        // <<<< ADICIONADAS VALIDAÇÕES
        if (!dadosProfissional.idusuario) {
            throw new Error('Usuário é obrigatório');
        }

        if (!dadosProfissional.especialidade || dadosProfissional.especialidade.length < 2) {
            throw new Error('Especialidade é obrigatória e deve ter pelo menos 2 caracteres');
        }

        if (!dadosProfissional.cro) {
            throw new Error('CRO é obrigatório');
        }

        if (!dadosProfissional.estadocro) {
            throw new Error('Estado do CRO é obrigatório');
        }

        if (profissional.idprofissional) {
            const response = await api.put(`/api/profissional/${profissional.idprofissional}`, dadosProfissional);
            return response.data;
        } else {
            const response = await api.post('/api/profissional', dadosProfissional);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar profissional:', error);
        // <<<< MELHOR TRATAMENTO DE ERRO
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.message) {
            throw error; // Re-lança erros de validação
        } else {
            throw new Error('Erro desconhecido ao salvar profissional.');
        }
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

// <<<< NOVAS FUNÇÕES ÚTEIS (seguindo padrão de pessoas)

// Buscar profissional por usuário
export const buscarProfissionalPorUsuario = async (idusuario) => {
    try {
        const response = await api.get(`/api/profissional/usuario/${idusuario}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar profissional por usuário:', error);
        throw error;
    }
};

// Listar profissionais por especialidade
export const listarProfissionaisPorEspecialidade = async (especialidade) => {
    try {
        const response = await api.get(`/api/profissional/especialidade/${especialidade}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar profissionais por especialidade:', error);
        throw error;
    }
};

// Listar profissionais ativos
export const listarProfissionaisAtivos = async () => {
    try {
        const response = await api.get('/api/profissional/ativos');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar profissionais ativos:', error);
        throw error;
    }
};

// Verificar se CRO já existe
export const verificarCROExistente = async (cro, estadocro, idProfissionalAtual = null) => {
    try {
        const params = { cro, estadocro };
        if (idProfissionalAtual) {
            params.excludeId = idProfissionalAtual;
        }
        
        const response = await api.get('/api/profissional/verificar-cro', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar CRO:', error);
        throw error;
    }
};

// Contar total de profissionais
export const contarProfissionais = async () => {
    try {
        const response = await api.get('/api/profissional/count');
        return response.data;
    } catch (error) {
        console.error('Erro ao contar profissionais:', error);
        throw error;
    }
};

export default api;
