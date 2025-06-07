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

// Listar todas as pessoas
export const listarPessoas = async () => {
    try {
        const response = await api.get('/api/pessoas');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        throw error;
    }
};

// Buscar pessoa por ID
export const buscarPessoa = async (id) => {
    try {
        const response = await api.get(`/api/pessoas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        throw error;
    }
};

// Buscar pessoa por CPF
export const buscarPessoaPorCPF = async (cpf) => {
    try {
        const response = await api.get(`/api/pessoas/cpf/${cpf}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pessoa por CPF:', error);
        throw error;
    }
};

// Buscar pessoas por nome
export const buscarPessoasPorNome = async (nome) => {
    try {
        const response = await api.get(`/api/pessoas/nome/${nome}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pessoas por nome:', error);
        throw error;
    }
};

// Salvar pessoa (criar ou atualizar)
export const salvarPessoa = async (pessoa) => {
    try {
        // Preparar dados da pessoa
        const dadosPessoa = {
            cpf: pessoa.cpf?.replace(/\D/g, ''), // Remove formatação do CPF
            nomecompleto: pessoa.nomecompleto?.trim(),
            datanascimento: pessoa.datanascimento || null,
            sexo: pessoa.sexo?.trim() || null,
            endereco: pessoa.endereco?.trim() || null,
            cep: pessoa.cep?.replace(/\D/g, '') || null, // Remove formatação do CEP
            cidade: pessoa.cidade?.trim() || null,
            uf: pessoa.uf?.trim() || null,
            email: pessoa.email?.trim() || null,
            celular: pessoa.celular?.replace(/\D/g, '') || null, // Remove formatação do telefone
            contatoemergencia: pessoa.contatoemergencia?.replace(/\D/g, '') || null,
            nomecontatoemergencia: pessoa.nomecontatoemergencia?.trim() || null,
            contatopreferencial: pessoa.contatopreferencial?.trim() || null,
            idusuario: pessoa.idusuario ? parseInt(pessoa.idusuario) : null
        };

        // Validações básicas
        if (!dadosPessoa.cpf || dadosPessoa.cpf.length !== 11) {
            throw new Error('CPF deve ter 11 dígitos');
        }

        if (!dadosPessoa.nomecompleto || dadosPessoa.nomecompleto.length < 2) {
            throw new Error('Nome completo é obrigatório e deve ter pelo menos 2 caracteres');
        }

        // Se é edição (tem ID)
        if (pessoa.idpessoa) {
            const response = await api.put(`/api/pessoas/${pessoa.idpessoa}`, dadosPessoa);
            return response.data;
        } else {
            // Criação
            const response = await api.post('/api/pessoas', dadosPessoa);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar pessoa:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }else {
        throw new Error('Erro desconhecido ao salvar pessoa.');
        }
    }
};

// Excluir pessoa
export const excluirPessoa = async (id) => {
    try {
        await api.delete(`/api/pessoas/${id}`);
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        throw error;
    }
};

// Verificar se CPF já existe
export const verificarCPFExistente = async (cpf, idPessoaAtual = null) => {
    try {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const params = { cpf: cpfLimpo };
        if (idPessoaAtual) {
            params.excludeId = idPessoaAtual;
        }
        
        const response = await api.get('/api/pessoas/verificar-cpf', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        throw error;
    }
};

// Listar pessoas por cidade
export const listarPessoasPorCidade = async (cidade) => {
    try {
        const response = await api.get(`/api/pessoas/cidade/${cidade}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pessoas por cidade:', error);
        throw error;
    }
};

// Listar pessoas por UF
export const listarPessoasPorUF = async (uf) => {
    try {
        const response = await api.get(`/api/pessoas/uf/${uf}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pessoas por UF:', error);
        throw error;
    }
};

// Listar pessoas por sexo
export const listarPessoasPorSexo = async (sexo) => {
    try {
        const response = await api.get(`/api/pessoas/sexo/${sexo}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pessoas por sexo:', error);
        throw error;
    }
};

// Buscar pessoas por faixa etária
export const buscarPessoasPorIdade = async (idadeMin, idadeMax) => {
    try {
        const response = await api.get('/api/pessoas/idade', {
            params: {
                min: idadeMin,
                max: idadeMax
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pessoas por idade:', error);
        throw error;
    }
};

// Contar total de pessoas
export const contarPessoas = async () => {
    try {
        const response = await api.get('/api/pessoas/count');
        return response.data;
    } catch (error) {
        console.error('Erro ao contar pessoas:', error);
        throw error;
    }
};

// Listar pessoas sem usuário vinculado
export const listarPessoasSemUsuario = async () => {
    try {
        const response = await api.get('/api/pessoas/sem-usuario');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pessoas sem usuário:', error);
        throw error;
    }
};

// Buscar endereço por CEP (usando API externa)
export const buscarEnderecoPorCEP = async (cep) => {
    try {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos');
        }
        
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (response.data.erro) {
            throw new Error('CEP não encontrado');
        }
        
        return {
            endereco: response.data.logradouro,
            cidade: response.data.localidade,
            uf: response.data.uf,
            bairro: response.data.bairro
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
    }
};

export default api;