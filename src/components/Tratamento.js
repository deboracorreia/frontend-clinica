import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarTratamentos, excluirTratamento, salvarTratamento } from '../services/tratamentoApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Tratamentos = () => {
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tratamentoAtual, setTratamentoAtual] = useState({
    nometratamento: ''
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarTratamentos();
  }, []);

  const carregarTratamentos = async () => {
    try {
      setLoading(true);
      const data = await listarTratamentos();
      setTratamentos(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar tratamentos', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTratamentoAtual({ ...tratamentoAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarTratamento(tratamentoAtual);
      setMensagem({ texto: 'Tratamento salvo com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      limparFormulario();
      carregarTratamentos();
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao salvar tratamento', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este tratamento?')) {
      try {
        await excluirTratamento(id);
        setMensagem({ texto: 'Tratamento excluído com sucesso!', tipo: 'sucesso' });
        carregarTratamentos();
      } catch {
        setMensagem({ texto: 'Erro ao excluir tratamento', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (tratamento) => {
    setTratamentoAtual({
      idtratamento: tratamento.idtratamento,
      nometratamento: tratamento.nometratamento || ''
    });
    setMostrarFormulario(true);
  };

  const limparFormulario = () => {
    setTratamentoAtual({
      nometratamento: ''
    });
  };

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '80px' }}>
          <div className="pagina-header">
            <h1>Gestão de Tratamentos</h1>
            <BotaoComIcone
              tipo="adicionar"
              texto="Novo Tratamento"
              onClick={() => {
                limparFormulario();
                setMostrarFormulario(true);
              }}
            />
          </div>

          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>
              {mensagem.texto}
              <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
            </div>
          )}

          <div className="card-conteudo">
            <div className="tabela-container">
              {loading ? (
                <div className="loading">Carregando...</div>
              ) : (
                <table className="tabela-dados">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome do Tratamento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tratamentos.map((tratamento) => (
                      <tr key={tratamento.idtratamento}>
                        <td>{tratamento.idtratamento}</td>
                        <td>{tratamento.nometratamento}</td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(tratamento)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(tratamento.idtratamento)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-container" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={() => setMostrarFormulario(false)}>×</button>
              <h2>{tratamentoAtual.idtratamento ? 'Editar Tratamento' : 'Novo Tratamento'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                  
                  <div>
                    <label>Nome do Tratamento *</label>
                    <input
                      name="nometratamento"
                      type="text"
                      value={tratamentoAtual.nometratamento}
                      onChange={handleChange}
                      required
                      placeholder="Digite o nome do tratamento"
                      maxLength="100"
                    />
                  </div>

                </div>

                <div className="form-acoes" style={{ marginTop: '20px' }}>
                  <BotaoComIcone tipo="salvar" texto="Salvar" type="submit" />
                  <BotaoComIcone tipo="excluir" texto="Cancelar" onClick={() => setMostrarFormulario(false)} />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tratamentos;