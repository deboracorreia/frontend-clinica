import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarProfissionais, excluirProfissional, salvarProfissional } from '../services/profissionalApi';
import { listarUsuarios } from '../services/usuarioApi'; // <<<< ADICIONADO
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // <<<< ADICIONADO
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [profissionalAtual, setProfissionalAtual] = useState({
    idusuario: '', // <<<< ALTERADO: removido o objeto usuario
    especialidade: '',
    cro: '',
    estadocro: '',
    ativo: 1
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarDados(); // <<<< ALTERADO: agora carrega usuários também
  }, []);

  // <<<< NOVO MÉTODO: carrega profissionais e usuários
  const carregarDados = async () => {
    try {
      setLoading(true);
      const [profissionaisData, usuariosData] = await Promise.all([
        listarProfissionais(),
        listarUsuarios()
      ]);
      setProfissionais(profissionaisData);
      setUsuarios(usuariosData);
    } catch {
      setMensagem({ texto: 'Erro ao carregar dados', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

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
      limparFormulario(); // <<<< ALTERADO: usar método limpar
      carregarProfissionais();
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao salvar profissional', tipo: 'erro' }); // <<<< MELHORADO
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
      ativo: profissional.ativo // <<<< ALTERADO: usar boolean diretamente
    });
    setMostrarFormulario(true);
  };

  // <<<< NOVO MÉTODO: limpar formulário
  const limparFormulario = () => {
    setProfissionalAtual({
      idusuario: '',
      especialidade: '',
      cro: '',
      estadocro: '',
      ativo: true // <<<< ALTERADO: usar boolean
    });
  };

  const formatarAtivo = (ativo) => (ativo ? 'Ativo' : 'Inativo'); // <<<< ALTERADO: boolean direto

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
                limparFormulario(); // <<<< ALTERADO: usar método limpar
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
                      <th>Usuário</th>
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
                        <td>{profissional.loginUsuario || 'Sem usuário'}</td>
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
                
                {/* <<<< ALTERADO: Select com lista de usuários */}
                <label>Vincular a Usuário *</label>
                <select
                  name="idusuario"
                  value={profissionalAtual.idusuario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.idusuario} value={usuario.idusuario}>
                      {usuario.login}
                    </option>
                  ))}
                </select>

                <label>Especialidade *</label>
                <input
                  name="especialidade"
                  type="text"
                  value={profissionalAtual.especialidade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Ortodontia, Endodontia..."
                />

                <label>CRO *</label>
                <input
                  name="cro"
                  type="text"
                  value={profissionalAtual.cro}
                  onChange={handleChange}
                  required
                  placeholder="Número do CRO"
                />

                <label>Estado do CRO *</label>
                <select
                  name="estadocro"
                  value={profissionalAtual.estadocro}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o estado</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>

                <label>Status *</label>
                <select
                  name="ativo"
                  value={profissionalAtual.ativo ? "true" : "false"}
                  onChange={(e) => setProfissionalAtual({...profissionalAtual, ativo: e.target.value === 'true'})}
                  required
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
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
