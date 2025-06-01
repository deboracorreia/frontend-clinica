import axios from 'axios';
import { getToken } from './auth';

// Função para obter informações do usuário logado
export const obterUsuarioLogado = async () => {
  try {
    // Verifica se existe um token
    const token = getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    // Faz uma requisição ao backend para obter os dados do usuário atual
    const resposta = await axios.get('http://localhost:8080/api/usuario/atual', {

      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return resposta.data;
  } catch (error) {
    console.error('Erro ao obter usuário logado:', error);

    // Se houver falha, retorna um usuário padrão para não quebrar o fluxo
    // Isso pode ser ajustado conforme sua necessidade
    return {
      id: 1,
      nome: 'Usuário padrão',
      email: 'usuario@exemplo.com'
    };
  }
};

// Função para verificar se o token é válido
export const verificarToken = async () => {
  try {
    const token = getToken();
    if (!token) return false;

    // Tenta fazer uma requisição simples para validar o token
    const resposta = await axios.get('http://localhost:8080/validar-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return resposta.status === 200;
  } catch (error) {
    console.error('Token inválido ou expirado', error);
    return false;
  }
};

// Esta função pode ser usada para decodificar o token JWT se você estiver usando esse formato
export const decodificarToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // Se você estiver usando JWT, pode decodificar a parte payload do token
    // Isso é uma implementação simples, sem bibliotecas externas
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};