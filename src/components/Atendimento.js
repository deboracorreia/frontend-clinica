import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarAtendimentos, excluirAtendimento, salvarAtendimento } from '../services/atendimentoApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Atendimentos = () => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [atendimentoAtual, setAtendimentoAtual] = useState({
    idagendamento: '',
    idprofissional: '',
    descricao: '',
    data: ''
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  const carregarAtendimentos = async () => {
    try {
      setLoading(true);
      const data = await listarAtendimentos();
      setAtendimentos(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar atendimentos', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtendimentoAtual({ ...atendimentoAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarAtendimento(atendimentoAtual);
      setMensagem({ texto: 'Atendimento salvo com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      setAtendimentoAtual({ idagendamento: '', idprofissional: '', descricao: '', data: '' });
      carregarAtendimentos();
    } catch {
      setMensagem({ texto: 'Erro ao salvar atendimento', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este atendimento?')) {
      try {
        await excluirAtendimento(id);
        setMensagem({ texto: 'Atendimento excluído com sucesso!', tipo: 'sucesso' });
        carregarAtendimentos();
      } catch {
        setMensagem({ texto: 'Erro ao excluir atendimento', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (atendimento) => {
    setAtendimentoAtual({
      idatendimento: atendimento.idatendimento,
      idagendamento: atendimento.idagendamento || '',
      idprofissional: atendimento.idprofissional || '',
      descricao: atendimento.descricao || '',
      data: atendimento.data ? atendimento.data.split('T')[0] : '' // Formatar data para input
    });
    setMostrarFormulario(true);
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '80px' }}>
          <div className="pagina-header">
            <h1>Gestão de Atendimentos</h1>
            <BotaoComIcone
              tipo="adicionar"
              texto="Novo Atendimento"
              onClick={() => {
                setAtendimentoAtual({ idagendamento: '', idprofissional: '', descricao: '', data: '' });
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
                      <th>ID Agendamento</th>
                      <th>ID Profissional</th>
                      <th>Descrição</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atendimentos.map((atendimento) => (
                      <tr key={atendimento.idatendimento}>
                        <td>{atendimento.idatendimento}</td>
                        <td>{atendimento.idagendamento}</td>
                        <td>{atendimento.idprofissional}</td>
                        <td>{atendimento.descricao}</td>
                        <td>{formatarData(atendimento.data)}</td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(atendimento)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(atendimento.idatendimento)} />
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
            <div className="modal-container">
              <button className="modal-close" onClick={() => setMostrarFormulario(false)}>×</button>
              <h2>{atendimentoAtual.idatendimento ? 'Editar Atendimento' : 'Novo Atendimento'}</h2>
              <form onSubmit={handleSubmit}>
                <label>ID Agendamento</label>
                <input
                  name="idagendamento"
                  type="number"
                  value={atendimentoAtual.idagendamento}
                  onChange={handleChange}
                  placeholder="Digite o ID do agendamento"
                  required
                />

                <label>ID Profissional</label>
                <input
                  name="idprofissional"
                  type="number"
                  value={atendimentoAtual.idprofissional}
                  onChange={handleChange}
                  placeholder="Digite o ID do profissional"
                  required
                />

                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={atendimentoAtual.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o atendimento realizado"
                  rows="4"
                  required
                />

                <label>Data</label>
                <input
                  name="data"
                  type="date"
                  value={atendimentoAtual.data}
                  onChange={handleChange}
                  required
                />

                <div className="form-acoes">
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

export default Atendimentos;