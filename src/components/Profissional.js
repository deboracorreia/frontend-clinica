import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarProfissionais, excluirProfissional, salvarProfissional } from '../services/profissionalApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [profissionalAtual, setProfissionalAtual] = useState({
    usuario: { id: '' },   // <<< ALTERAÇÃO AQUI
    especialidade: '',
    cro: '',
    estadocro: '',
    ativo: 1
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarProfissionais();
  }, []);

  const carregarProfissionais = async () => {
    try {
      setLoading(true);
      const data = await listarProfissionais();
      setProfissionais(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar profissionais', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfissionalAtual({ ...profissionalAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarProfissional(profissionalAtual);
      setMensagem({ texto: 'Profissional salvo com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      setProfissionalAtual({ idusuario: '', especialidade: '', cro: '', estadocro: '', ativo: 1 });
      carregarProfissionais();
    } catch {
      setMensagem({ texto: 'Erro ao salvar profissional', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este profissional?')) {
      try {
        await excluirProfissional(id);
        setMensagem({ texto: 'Profissional excluído com sucesso!', tipo: 'sucesso' });
        carregarProfissionais();
      } catch {
        setMensagem({ texto: 'Erro ao excluir profissional', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (profissional) => {
    setProfissionalAtual({
      idprofissional: profissional.idprofissional,
      idusuario: profissional.idusuario || '',
      especialidade: profissional.especialidade || '',
      cro: profissional.cro || '',
      estadocro: profissional.estadocro || '',
      ativo: profissional.ativo
    });
    setMostrarFormulario(true);
  };

  const formatarAtivo = (ativo) => (ativo === 1 ? 'Ativo' : 'Inativo');

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '80px' }}>
          <div className="pagina-header">
            <h1>Gestão de Profissionais</h1>
            <BotaoComIcone
              tipo="adicionar"
              texto="Novo Profissional"
              onClick={() => {
                setProfissionalAtual({ idusuario: '', especialidade: '', cro: '', estadocro: '', ativo: 1 });
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
                      <th>Especialidade</th>
                      <th>CRO</th>
                      <th>Estado</th>
                      <th>Ativo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profissionais.map((profissional) => (
                      <tr key={profissional.idprofissional}>
                        <td>{profissional.especialidade}</td>
                        <td>{profissional.cro}</td>
                        <td>{profissional.estadocro}</td>
                        <td>{formatarAtivo(profissional.ativo)}</td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(profissional)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(profissional.idprofissional)} />
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
              <h2>{profissionalAtual.idprofissional ? 'Editar Profissional' : 'Novo Profissional'}</h2>
              <form onSubmit={handleSubmit}>
                <label>ID Usuário</label>
                <input
                  name="idusuario"
                  type="number"
                  value={profissionalAtual.idusuario}
                  onChange={handleChange}
                  required
                />

                <label>Especialidade</label>
                <input
                  name="especialidade"
                  type="text"
                  value={profissionalAtual.especialidade}
                  onChange={handleChange}
                  required
                />

                <label>CRO</label>
                <input
                  name="cro"
                  type="text"
                  value={profissionalAtual.cro}
                  onChange={handleChange}
                  required
                />

                <label>Estado do CRO</label>
                <input
                  name="estadocro"
                  type="text"
                  value={profissionalAtual.estadocro}
                  onChange={handleChange}
                  required
                />

                <label>Ativo</label>
                <select
                  name="ativo"
                  value={profissionalAtual.ativo}
                  onChange={handleChange}
                  required
                >
                  <option value={1}>Ativo</option>
                  <option value={0}>Inativo</option>
                </select>

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

export default Profissionais;
