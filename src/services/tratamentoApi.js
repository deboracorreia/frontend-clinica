import api from './usuarioApi'; // usa a mesma instância com token

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
export const buscarTratamentoPorId = async (id) => {
  try {
    const response = await api.get(`/api/tratamentos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tratamento:', error);
    throw error;
  }
};

// Salvar tratamento (criar ou atualizar)
export const salvarTratamento = async (tratamento) => {
  try {
    if (tratamento.id) {
      // Atualizar tratamento existente
      const response = await api.put(`/api/tratamentos/${tratamento.id}`, tratamento);
      return response.data;
    } else {
      // Criar novo tratamento
      const response = await api.post('/api/tratamentos', tratamento);
      return response.data;
    }
  } catch (error) {
    console.error('Erro ao salvar tratamento:', error);
    throw error;
  }
};

// Excluir tratamento
export const excluirTratamento = async (id) => {
  try {
    await api.delete(`/api/tratamentos/${id}`);
  } catch (error) {
    console.error('Erro ao excluir tratamento:', error);
    throw error;
  }
};