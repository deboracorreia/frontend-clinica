import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarUsuarios, excluirUsuario, salvarUsuario } from '../services/usuarioApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState({
    login: '',
    senha: '',
    idpessoa: '',
    tipo: '1', // valor padrão
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar usuários', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioAtual({ ...usuarioAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarUsuario(usuarioAtual);
      setMensagem({ texto: 'Usuário salvo com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      setUsuarioAtual({ login: '', senha: '', idpessoa: '', tipo: 'usuario' });
      carregarUsuarios();
    } catch {
      setMensagem({ texto: 'Erro ao salvar usuário', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este usuário?')) {
      try {
        await excluirUsuario(id);
        setMensagem({ texto: 'Usuário excluído com sucesso!', tipo: 'sucesso' });
        carregarUsuarios();
      } catch {
        setMensagem({ texto: 'Erro ao excluir usuário', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioAtual({ 
      idusuario: usuario.idusuario,
      login: usuario.login || '',
      tipo: usuario.tipo,
      senha: '' // Limpa o campo senha ao editar
    });
    setMostrarFormulario(true);
  };

  const formatarTipo = (tipo) => {
    switch(tipo) {
      case 0: return 'Administrador';
      case 1: return 'Usuário';
      default: return tipo;
    }
  };

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '80px' }}>
          <div className="pagina-header">
            <h1>Gestão de Usuários</h1>
            <BotaoComIcone
              tipo="adicionar"
              texto="Novo Usuário"
              onClick={() => {
                setUsuarioAtual({ login: '', senha: '', idpessoa: '', tipo: '1' });
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
                      <th>Login</th>
                      <th>Tipo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.idusuario}>
                        <td>{usuario.login}</td>
                        <td>{formatarTipo(usuario.tipo)}</td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(usuario)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(usuario.idusuario)} />
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
              <h2>{usuarioAtual.idusuario ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <form onSubmit={handleSubmit}>
                <label>Login</label>
                <input
                  name="login"
                  type="text"
                  value={usuarioAtual.login}
                  onChange={handleChange}
                  required
                />

                {/* Campo senha - só aparece na criação de novo usuário */}
                {!usuarioAtual.idusuario && (
                  <>
                    <label>Senha</label>
                    <input
                      name="senha"
                      type="password"
                      value={usuarioAtual.senha}
                      onChange={handleChange}
                      required
                      placeholder="Digite a senha do usuário"
                    />
                  </>
                )}

                <label>Tipo de Usuário</label>
                <select
                  name="tipo"
                  value={usuarioAtual.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Usuário</option>
                  <option value="0">Administrador</option>
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

export default Usuarios;