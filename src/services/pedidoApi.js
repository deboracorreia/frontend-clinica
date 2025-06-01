import api from './api'; // usa a instância com token

const API_URL = '/pedidos';
const ITENS_URL = '/itenspedido';

export const listarPedidos = async () => {
  const resposta = await api.get(API_URL);
  return resposta.data;
};

export const buscarPedidoPorId = async (id) => {
  const resposta = await api.get(`${API_URL}/${id}`);
  return resposta.data;
};

export const salvarPedido = async (pedido) => {
  const resposta = await api.post(API_URL, pedido);
  return resposta.data;
};

export const atualizarPedido = async (id, pedido) => {
  const resposta = await api.put(`${API_URL}/${id}`, pedido);
  return resposta.data;
};

export const excluirPedido = async (id) => {
  const resposta = await api.delete(`${API_URL}/${id}`);
  return resposta.data;
};

export const excluirItemPedido = async (id) => {
  const resposta = await api.delete(`${ITENS_URL}/${id}`);
  return resposta.data;
};
