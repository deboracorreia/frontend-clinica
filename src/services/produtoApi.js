import api from './clienteApi'; // usa a mesma instância com token

export const listarProdutos = async () => {
    try {
        const response = await api.get('/api/produtos');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw error;
    }
};



export const salvarProduto = async (produto) => {
    if (produto.id) {
        const response = await api.put(`/api/produtos/${produto.id}`, produto);
        return response.data;
    } else {
        const response = await api.post('/api/produtos', produto);
        return response.data;
    }
};

export const excluirProduto = async (id) => {
    await api.delete(`/api/produtos/${id}`);
};
