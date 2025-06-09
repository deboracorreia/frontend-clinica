import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { 
  listarAtendimentos, 
  excluirAtendimento,
  salvarAtendimento,
  buscarAtendimentosPorStatus,
  buscarAtendimentosPorUsuario,
  buscarAtendimentosPorStatusEUsuario,
  STATUS_ATENDIMENTO,
  formatarStatus,
  getCorStatus,
  formatarDataHorario
} from '../services/atendimentoApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

// Funções auxiliares para autenticação
const getUsuarioLogado = () => {
  try {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const isAdmin = (usuario) => {
  return usuario && usuario.tipo === 0;
};

const Atendimentos = () => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'
  const [filtroVisao, setFiltroVisao] = useState('todos'); // 'todos', 'meus' (só para admin)
  const [atendimentoAtual, setAtendimentoAtual] = useState({
    idagendamento: '',
    descricao: '',
    data: '',
    status: 'EM_ANDAMENTO'
  });
  const [agendamentoInfo, setAgendamentoInfo] = useState(null);
  const [isEdicao, setIsEdicao] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    // Carregar dados do usuário logado
    const usuario = getUsuarioLogado();
    if (usuario) {
      setUsuarioLogado(usuario);
      setEhAdmin(isAdmin(usuario));
    }
    
    carregarAtendimentos();
  }, []);

  const carregarAtendimentos = async () => {
    try {
      setLoading(true);
      
      const usuario = getUsuarioLogado();
      const admin = isAdmin(usuario);
      
      let data;
      
      // Determinar qual busca fazer baseado nos filtros
      if (admin && filtroVisao === 'todos') {
        // Admin vendo todos os atendimentos
        if (filtroStatus === 'todos') {
          data = await listarAtendimentos();
        } else {
          data = await buscarAtendimentosPorStatus(filtroStatus);
        }
      } else {
        // Usuário comum ou admin vendo apenas os seus
        if (usuario && usuario.idusuario) {
          if (filtroStatus === 'todos') {
            data = await buscarAtendimentosPorUsuario(usuario.idusuario);
          } else {
            data = await buscarAtendimentosPorStatusEUsuario(filtroStatus, usuario.idusuario);
          }
        } else {
          data = [];
        }
      }
      
      setAtendimentos(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar atendimentos', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroStatusChange = async (novoStatus) => {
    setFiltroStatus(novoStatus);
    await aplicarFiltros(novoStatus, filtroVisao);
  };

  const handleFiltroVisaoChange = async (novaVisao) => {
    setFiltroVisao(novaVisao);
    await aplicarFiltros(filtroStatus, novaVisao);
  };

  const aplicarFiltros = async (status, visao) => {
    try {
      setLoading(true);
      
      let data;
      
      if (ehAdmin && visao === 'todos') {
        // Admin vendo todos
        if (status === 'todos') {
          data = await listarAtendimentos();
        } else {
          data = await buscarAtendimentosPorStatus(status);
        }
      } else {
        // Usuário comum ou admin vendo apenas os seus
        if (usuarioLogado && usuarioLogado.idusuario) {
          if (status === 'todos') {
            data = await buscarAtendimentosPorUsuario(usuarioLogado.idusuario);
          } else {
            data = await buscarAtendimentosPorStatusEUsuario(status, usuarioLogado.idusuario);
          }
        } else {
          data = [];
        }
      }
      
      setAtendimentos(data);
    } catch {
      setMensagem({ texto: 'Erro ao aplicar filtros', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este atendimento?')) {
      try {
        await excluirAtendimento(id);
        setMensagem({ texto: 'Atendimento excluído com sucesso!', tipo: 'sucesso' });
        await carregarAtendimentos();
      } catch {
        setMensagem({ texto: 'Erro ao excluir atendimento', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (atendimento) => {
    setAtendimentoAtual({
      idatendimento: atendimento.idatendimento,
      idagendamento: atendimento.idagendamento,
      descricao: atendimento.descricao || '',
      data: atendimento.data ? new Date(atendimento.data).toISOString().slice(0, 16) : '',
      status: atendimento.status
    });
    
    // Montar informações do agendamento
    setAgendamentoInfo({
      idagendamento: atendimento.idagendamento,
      datahorario: atendimento.dataAgendamento,
      nomeUsuario: atendimento.nomeUsuario,
      nomeProfissional: atendimento.nomeProfissional,
      nomeTratamento: atendimento.nomeTratamento,
      descricao: atendimento.descricaoAgendamento
    });
    
    setIsEdicao(true);
    setMostrarFormulario(true);
  };

  const handleNovoAtendimento = () => {
    setAtendimentoAtual({
      idagendamento: '',
      descricao: '',
      data: new Date().toISOString().slice(0, 16),
      status: 'EM_ANDAMENTO'
    });
    setAgendamentoInfo(null);
    setIsEdicao(false);
    setMostrarFormulario(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtendimentoAtual({ ...atendimentoAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Converter data para ISO se necessário
      const dadosParaEnvio = {
        ...atendimentoAtual,
        data: atendimentoAtual.data ? new Date(atendimentoAtual.data).toISOString() : new Date().toISOString()
      };

      await salvarAtendimento(dadosParaEnvio);
      
      setMensagem({ 
        texto: isEdicao ? 'Atendimento atualizado com sucesso!' : 'Atendimento criado com sucesso!', 
        tipo: 'sucesso' 
      });
      
      setMostrarFormulario(false);
      setIsEdicao(false);
      setAgendamentoInfo(null);
      
      // Recarregar lista de atendimentos
      await carregarAtendimentos();
      
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao salvar atendimento', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setIsEdicao(false);
    setAgendamentoInfo(null);
    setAtendimentoAtual({
      idagendamento: '',
      descricao: '',
      data: '',
      status: 'EM_ANDAMENTO'
    });
  };

  const renderStatusBadge = (status) => {
    return (
      <span
        style={{
          backgroundColor: getCorStatus(status),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        {formatarStatus(status)}
      </span>
    );
  };

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '80px' }}>
          <div className="pagina-header">
            <h1>Gestão de Atendimentos</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              
              {/* Filtros */}
              <div className="filtros-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                
                {/* Filtro por status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Status:</span>
                  <select
                    value={filtroStatus}
                    onChange={(e) => handleFiltroStatusChange(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '13px'
                    }}
                  >
                    <option value="todos">Todos</option>
                    <option value={STATUS_ATENDIMENTO.EM_ANDAMENTO}>Em Andamento</option>
                    <option value={STATUS_ATENDIMENTO.CONCLUIDO}>Concluído</option>
                    <option value={STATUS_ATENDIMENTO.CANCELADO}>Cancelado</option>
                  </select>
                </div>

                {/* Filtro de visão - só para admin */}
                {ehAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Visualizar:</span>
                    <select
                      value={filtroVisao}
                      onChange={(e) => handleFiltroVisaoChange(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '13px'
                      }}
                    >
                      <option value="todos">Todos os atendimentos</option>
                      <option value="meus">Meus atendimentos</option>
                    </select>
                  </div>
                )}
              </div>
              
              {/* Informação para usuários comuns */}
              {!ehAdmin && (
                <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                  Visualizando apenas seus atendimentos
                </div>
              )}
            </div>
          </div>

          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>
              {mensagem.texto}
              <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
            </div>
          )}

          <div className="card-conteudo">
            {/* Contador de atendimentos */}
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f8f9fa', 
              borderBottom: '1px solid #dee2e6',
              fontSize: '14px',
              color: '#495057'
            }}>
              <strong>
                {atendimentos.length} atendimento{atendimentos.length !== 1 ? 's' : ''}
                {filtroStatus !== 'todos' && ` - ${formatarStatus(filtroStatus)}`}
                {ehAdmin && filtroVisao === 'todos' ? ' (todos os usuários)' : ' (seus atendimentos)'}
              </strong>
              {usuarioLogado && (
                <span style={{ marginLeft: '10px', color: '#6c757d' }}>
                  • Usuário: {usuarioLogado.login} 
                  {usuarioLogado.tipo === 0 ? ' (Administrador)' : ' (Usuário)'}
                </span>
              )}
            </div>
            
            <div className="tabela-container">
              {loading ? (
                <div className="loading">Carregando...</div>
              ) : (
                <table className="tabela-dados">
                  <thead>
                    <tr>
                      <th>Data do Atendimento</th>
                      <th>Paciente</th>
                      <th>Profissional</th>
                      <th>Tratamento</th>
                      <th>Status</th>
                      <th>Data do Agendamento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atendimentos.map((atendimento) => (
                      <tr key={atendimento.idatendimento}>
                        <td>{formatarDataHorario(atendimento.data)}</td>
                        <td>{atendimento.nomeUsuario || 'Usuário não informado'}</td>
                        <td>{atendimento.nomeProfissional || 'Profissional não informado'}</td>
                        <td>{atendimento.nomeTratamento || 'Sem tratamento'}</td>
                        <td>{renderStatusBadge(atendimento.status)}</td>
                        <td>{formatarDataHorario(atendimento.dataAgendamento)}</td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(atendimento)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(atendimento.idatendimento)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {atendimentos.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                          Nenhum atendimento encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        {/* Modal para criar/editar atendimento */}
        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-container" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={handleCancelar}>×</button>
              <h2>{isEdicao ? 'Editar Atendimento' : 'Novo Atendimento'}</h2>
              
              {/* Informações do Agendamento */}
              {agendamentoInfo && (
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '6px', 
                  marginBottom: '20px',
                  border: '1px solid #dee2e6' 
                }}>
                  <h4 style={{ marginBottom: '10px', color: '#495057' }}>Informações do Agendamento</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div><strong>Data/Hora:</strong> {formatarDataHorario(agendamentoInfo.datahorario)}</div>
                    <div><strong>Paciente:</strong> {agendamentoInfo.nomeUsuario}</div>
                    <div><strong>Profissional:</strong> {agendamentoInfo.nomeProfissional}</div>
                    <div><strong>Tratamento:</strong> {agendamentoInfo.nomeTratamento || 'Não especificado'}</div>
                    {agendamentoInfo.descricao && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Observações do Agendamento:</strong> {agendamentoInfo.descricao}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* Campo para selecionar agendamento (só no modo criação) */}
                {!isEdicao && (
                  <div style={{ marginBottom: '20px' }}>
                    <label>Agendamento *</label>
                    <select
                      name="idagendamento"
                      value={atendimentoAtual.idagendamento}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="">Selecione um agendamento</option>
                      {/* Aqui você pode carregar lista de agendamentos sem atendimento */}
                    </select>
                  </div>
                )}
                
                <div style={{ marginBottom: '20px' }}>
                  <label>Data e Hora do Atendimento *</label>
                  <input
                    name="data"
                    type="datetime-local"
                    value={atendimentoAtual.data}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label>Status do Atendimento *</label>
                  <select
                    name="status"
                    value={atendimentoAtual.status}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label>Descrição do Atendimento *</label>
                  <textarea
                    name="descricao"
                    value={atendimentoAtual.descricao}
                    onChange={handleChange}
                    required
                    placeholder="Descreva o que foi realizado no atendimento, procedimentos, observações, etc..."
                    rows="6"
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd',
                      resize: 'vertical',
                      minHeight: '100px'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    Descreva detalhadamente o atendimento realizado, procedimentos executados e observações importantes.
                  </small>
                </div>

                <div className="form-acoes" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <BotaoComIcone 
                    tipo="salvar" 
                    texto={isEdicao ? "Atualizar Atendimento" : "Criar Atendimento"} 
                    type="submit"
                    disabled={loading}
                  />
                  <BotaoComIcone 
                    tipo="excluir" 
                    texto="Cancelar" 
                    onClick={handleCancelar}
                    disabled={loading}
                  />
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