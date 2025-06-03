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

// Listar todos os usuários
export const listarUsuarios = async () => {
    try {
        const response = await api.get('/api/usuarios');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar usuarios:', error);
        throw error;
    }
};

// Buscar usuário por ID
export const buscarUsuario = async (id) => {
    try {
        const response = await api.get(`/api/usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        throw error;
    }
};

// Salvar usuário (criar ou atualizar)
export const salvarUsuario = async (usuario) => {
    try {
        // Preparar dados do usuário com os novos campos
        const dadosUsuario = {
            login: usuario.login?.trim(),
            senha: usuario.senha,
            idpessoa: parseInt(usuario.idpessoa),
            tipo: usuario.tipo?.trim()?.toLowerCase() || 'usuario'
        };

        // Se é edição (tem ID)
        if (usuario.idusuario) {
            // Se senha estiver vazia na edição, não enviar
            if (!usuario.senha || usuario.senha.trim() === '') {
                delete dadosUsuario.senha;
            }
            
            const response = await api.put(`/api/usuarios/${usuario.idusuario}`, dadosUsuario);
            return response.data;
        } else {
            // Criação - senha é obrigatória
            if (!dadosUsuario.senha || dadosUsuario.senha.trim() === '') {
                throw new Error('Senha é obrigatória para novo usuário');
            }
            
            const response = await api.post('/api/usuarios', dadosUsuario);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar usuario:', error);
        throw error;
    }
};

// Excluir usuário
export const excluirUsuario = async (id) => {
    try {
        await api.delete(`/api/usuarios/${id}`);
    } catch (error) {
        console.error('Erro ao excluir usuario:', error);
        throw error;
    }
};

// Validar login (para autenticação)
export const validarLogin = async (login, senha) => {
    try {
        const response = await api.post('/api/usuarios/login', {
            login: login.trim(),
            senha: senha
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao validar login:', error);
        throw error;
    }
};

// Verificar se login já existe
export const verificarLoginExistente = async (login, idUsuarioAtual = null) => {
    try {
        const params = { login: login.trim() };
        if (idUsuarioAtual) {
            params.excludeId = idUsuarioAtual;
        }
        
        const response = await api.get('/api/usuarios/verificar-login', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        throw error;
    }
};

// Alterar senha
export const alterarSenha = async (id, senhaAtual, novaSenha) => {
    try {
        const response = await api.put(`/api/usuarios/${id}/alterar-senha`, {
            senhaAtual: senhaAtual,
            novaSenha: novaSenha
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        throw error;
    }
};

// Listar usuários por tipo
export const listarUsuariosPorTipo = async (tipo) => {
    try {
        const response = await api.get(`/api/usuarios/tipo/${tipo}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar usuários por tipo:', error);
        throw error;
    }
};

// Listar usuários por pessoa
export const listarUsuariosPorPessoa = async (idpessoa) => {
    try {
        const response = await api.get(`/api/usuarios/pessoa/${idpessoa}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar usuários por pessoa:', error);
        throw error;
    }
};

export default api;