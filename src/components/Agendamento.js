import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { 
  listarAgendamentos, 
  excluirAgendamento, 
  salvarAgendamento, 
  formatarDataHorario, 
  extrairData, 
  extrairHora, 
  formatarDataParaISO,
  listarProfissionaisAtivos,
  buscarAgendamentosPorUsuario
} from '../services/agendamentoApi';
import { listarUsuarios } from '../services/usuarioApi';
import { listarTratamentos } from '../services/tratamentoApi';
import { salvarAtendimento, existeAtendimentoParaAgendamento } from '../services/atendimentoApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';
import { useNavigate } from 'react-router-dom';

// Funções auxiliares para autenticação (você pode ajustar conforme sua implementação)
const getUsuarioLogado = () => {
  try {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const isAdmin = (usuario) => {
  // tipo = 0 é admin, tipo = 1 é usuário comum
  return usuario && usuario.tipo === 0;
};

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosComAtendimento, setAgendamentosComAtendimento] = useState(new Set());
  const [usuarios, setUsuarios] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioAtendimento, setMostrarFormularioAtendimento] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('todos'); // 'todos', 'meus'
  const [agendamentoParaAtender, setAgendamentoParaAtender] = useState(null);
  const [atendimentoAtual, setAtendimentoAtual] = useState({
    idagendamento: '',
    descricao: '',
    data: '',
    status: 'EM_ANDAMENTO'
  });
  const [agendamentoAtual, setAgendamentoAtual] = useState({
    datahorario: '',
    data: '',
    hora: '',
    descricao: '',
    idusuario: '',
    idtratamento: '',
    idprofissional: ''
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar dados do usuário logado
    const usuario = getUsuarioLogado();
    if (usuario) {
      setUsuarioLogado(usuario);
      setEhAdmin(isAdmin(usuario));
    }
    
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar dados básicos
      const [usuariosData, profissionaisData, tratamentosData] = await Promise.all([
        listarUsuarios(),
        listarProfissionaisAtivos(),
        listarTratamentos()
      ]);
      
      setUsuarios(usuariosData);
      setProfissionais(profissionaisData);
      setTratamentos(tratamentosData);
      
      // Carregar agendamentos baseado no perfil do usuário
      await carregarAgendamentos();
      
    } catch {
      setMensagem({ texto: 'Erro ao carregar dados', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      
      const usuario = getUsuarioLogado();
      const admin = isAdmin(usuario);
      
      let data;
      
      if (admin && filtroAtivo === 'todos') {
        // Admin (tipo = 0) pode ver todos os agendamentos
        data = await listarAgendamentos();
      } else {
        // Usuário comum (tipo = 1) ou admin com filtro "meus" - ver apenas seus agendamentos
        if (usuario && usuario.idusuario) {
          data = await buscarAgendamentosPorUsuario(usuario.idusuario);
        } else {
          data = [];
        }
      }
      
      setAgendamentos(data);
      
      // Verificar quais agendamentos já têm atendimento
      await verificarAtendimentosExistentes(data);
      
    } catch {
      setMensagem({ texto: 'Erro ao carregar agendamentos', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const verificarAtendimentosExistentes = async (agendamentosList) => {
    try {
      const agendamentosComAtendimentoSet = new Set();
      
      // Verificar cada agendamento se já tem atendimento
      for (const agendamento of agendamentosList) {
        try {
          const temAtendimento = await existeAtendimentoParaAgendamento(agendamento.idagendamento);
          if (temAtendimento) {
            agendamentosComAtendimentoSet.add(agendamento.idagendamento);
          }
        } catch (error) {
          // Se der erro na verificação, assume que não tem atendimento
          console.log(`Erro ao verificar atendimento para agendamento ${agendamento.idagendamento}:`, error);
        }
      }
      
      setAgendamentosComAtendimento(agendamentosComAtendimentoSet);
    } catch (error) {
      console.error('Erro ao verificar atendimentos existentes:', error);
    }
  };

  const handleFiltroChange = async (novoFiltro) => {
    setFiltroAtivo(novoFiltro);
    
    try {
      setLoading(true);
      
      let data;
      if (novoFiltro === 'todos' && ehAdmin) {
        // Admin (tipo = 0) pode ver todos
        data = await listarAgendamentos();
      } else {
        // Usuário (tipo = 1) ou admin vendo apenas os seus
        if (usuarioLogado && usuarioLogado.idusuario) {
          data = await buscarAgendamentosPorUsuario(usuarioLogado.idusuario);
        } else {
          data = [];
        }
      }
      
      setAgendamentos(data);
    } catch {
      setMensagem({ texto: 'Erro ao aplicar filtro', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgendamentoAtual({ ...agendamentoAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combinar data e hora
      const datahorario = formatarDataParaISO(agendamentoAtual.data, agendamentoAtual.hora);
      
      const dadosParaEnvio = {
        ...agendamentoAtual,
        datahorario: datahorario
      };

      await salvarAgendamento(dadosParaEnvio);
      setMensagem({ texto: 'Agendamento salvo com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      limparFormulario();
      
      // Recarregar agendamentos respeitando o filtro atual
      await carregarAgendamentos();
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao salvar agendamento', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este agendamento?')) {
      try {
        await excluirAgendamento(id);
        setMensagem({ texto: 'Agendamento excluído com sucesso!', tipo: 'sucesso' });
        
        // Recarregar agendamentos respeitando o filtro atual
        await carregarAgendamentos();
      } catch {
        setMensagem({ texto: 'Erro ao excluir agendamento', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (agendamento) => {
    setAgendamentoAtual({
      idagendamento: agendamento.idagendamento,
      datahorario: agendamento.datahorario,
      data: extrairData(agendamento.datahorario),
      hora: extrairHora(agendamento.datahorario),
      descricao: agendamento.descricao || '',
      idusuario: agendamento.idusuario || '',
      idtratamento: agendamento.idtratamento || '',
      idprofissional: agendamento.idprofissional || ''
    });
    setMostrarFormulario(true);
  };

  const handleAtender = (agendamento) => {
    // Configurar dados para o formulário de atendimento
    setAgendamentoParaAtender(agendamento);
    setAtendimentoAtual({
      idagendamento: agendamento.idagendamento,
      descricao: '',
      data: new Date().toISOString().slice(0, 16), // Formato datetime-local
      status: 'EM_ANDAMENTO'
    });
    setMostrarFormularioAtendimento(true);
  };

  const limparFormulario = () => {
    setAgendamentoAtual({
      datahorario: '',
      data: '',
      hora: '',
      descricao: '',
      idusuario: usuarioLogado && usuarioLogado.tipo === 1 ? usuarioLogado.idusuario : '', // Auto-selecionar se for usuário comum (tipo = 1)
      idtratamento: '',
      idprofissional: ''
    });
  };

  const criarEventoGoogleCalendar = (agendamento) => {
    // Formatar data e hora para o formato do Google Calendar
    const dataInicio = new Date(agendamento.datahorario);
    const dataFim = new Date(dataInicio.getTime() + (60 * 60 * 1000)); // 1 hora de duração
    
    // Converter para o formato ISO sem milissegundos
    const formatarDataGoogle = (data) => {
      return data.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const inicio = formatarDataGoogle(dataInicio);
    const fim = formatarDataGoogle(dataFim);
    
    // Montar título e descrição
    const titulo = `Consulta - ${agendamento.nomeTratamento || 'Consulta Odontológica'}`;
    const descricao = `
Paciente: ${agendamento.nomeUsuario}
Profissional: ${agendamento.nomeProfissional}
Tratamento: ${agendamento.nomeTratamento || 'Não especificado'}
${agendamento.descricao ? `Observações: ${agendamento.descricao}` : ''}
    `.trim();
    
    // Montar URL do Google Calendar
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: titulo,
      dates: `${inicio}/${fim}`,
      details: descricao,
      location: 'Clínica Odontológica', // Você pode personalizar isso
    });
    
    const url = `${baseUrl}?${params.toString()}`;
    
    // Abrir em nova aba
    window.open(url, '_blank');
  };

  const getDataMinima = () => {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 1); // Próximo dia
    return hoje.toISOString().split('T')[0];
  };

  const getHorariosDisponiveis = () => {
    const horarios = [];
    for (let h = 8; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hora = h.toString().padStart(2, '0');
        const minuto = m.toString().padStart(2, '0');
        horarios.push(`${hora}:${minuto}`);
      }
    }
    return horarios;
  };

  const handleChangeAtendimento = (e) => {
    const { name, value } = e.target;
    setAtendimentoAtual({ ...atendimentoAtual, [name]: value });
  };

  const handleSubmitAtendimento = async (e) => {
    e.preventDefault();
    try {
      // Converter data para ISO se necessário
      const dadosParaEnvio = {
        ...atendimentoAtual,
        data: atendimentoAtual.data ? new Date(atendimentoAtual.data).toISOString() : new Date().toISOString()
      };

      await salvarAtendimento(dadosParaEnvio);
      setMensagem({ texto: 'Atendimento criado com sucesso!', tipo: 'sucesso' });
      setMostrarFormularioAtendimento(false);
      
      // Atualizar lista de agendamentos com atendimento
      setAgendamentosComAtendimento(prev => new Set([...prev, atendimentoAtual.idagendamento]));
      
      // Redirecionar para a tela de atendimentos
      setTimeout(() => {
        navigate('/atendimentos');
      }, 2000);
      
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao criar atendimento', tipo: 'erro' });
    }
  };

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '80px' }}>
          <div className="pagina-header">
            <h1>Gestão de Agendamentos</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              
              {/* Filtros - só mostrar para administradores (tipo = 0) */}
              {ehAdmin && (
                <div className="filtros-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Visualizar:</span>
                  <select
                    value={filtroAtivo}
                    onChange={(e) => handleFiltroChange(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  >
                    <option value="todos">Todos os agendamentos</option>
                    <option value="meus">Meus agendamentos</option>
                  </select>
                </div>
              )}
              
              {/* Informação para usuários comuns (tipo = 1) */}
              {!ehAdmin && (
                <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                  Visualizando apenas seus agendamentos
                </div>
              )}
              
              <BotaoComIcone
                tipo="adicionar"
                texto="Novo Agendamento"
                onClick={() => {
                  limparFormulario();
                  setMostrarFormulario(true);
                }}
              />
            </div>
          </div>

          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>
              {mensagem.texto}
              <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
            </div>
          )}

          <div className="card-conteudo">
            {/* Contador de agendamentos */}
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f8f9fa', 
              borderBottom: '1px solid #dee2e6',
              fontSize: '14px',
              color: '#495057'
            }}>
              <strong>
                {agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''} 
                {ehAdmin && filtroAtivo === 'todos' ? ' (todos os usuários)' : ' (seus agendamentos)'}
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
                      <th>Data/Hora</th>
                      <th>Usuário</th>
                      <th>Profissional</th>
                      <th>Tratamento</th>
                      <th>Descrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((agendamento) => (
                      <tr key={agendamento.idagendamento}>
                        <td>{formatarDataHorario(agendamento.datahorario)}</td>
                        <td>{agendamento.nomeUsuario || 'Usuário não informado'}</td>
                        <td>{agendamento.nomeProfissional || 'Profissional não informado'}</td>
                        <td>{agendamento.nomeTratamento || 'Sem tratamento'}</td>
                        <td>{agendamento.descricao || '-'}</td>
                        <td>
                          <div className="acoes">
                            <button 
                              className="botao-google-calendar"
                              onClick={() => criarEventoGoogleCalendar(agendamento)}
                              title="Adicionar ao Google Calendar"
                              style={{
                                backgroundColor: '#4285f4',
                                color: 'white',
                                border: '1px solid #4285f4',
                                borderRadius: '4px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                margin: '0 2px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#3367d6';
                                e.target.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#4285f4';
                                e.target.style.transform = 'translateY(0)';
                              }}
                            >
                              📅 Google
                            </button>
                            
                            {/* Só mostrar botão Atender se não existir atendimento */}
                            {!agendamentosComAtendimento.has(agendamento.idagendamento) && (
                              <button 
                                className="botao-atender"
                                onClick={() => handleAtender(agendamento)}
                                title="Iniciar Atendimento"
                                style={{
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: '1px solid #28a745',
                                  borderRadius: '4px',
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  margin: '0 2px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#218838';
                                  e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#28a745';
                                  e.target.style.transform = 'translateY(0)';
                                }}
                              >
                                🩺 Atender
                              </button>
                            )}

                            {/* Mostrar indicador se já tem atendimento */}
                            {agendamentosComAtendimento.has(agendamento.idagendamento) && (
                              <span 
                                style={{
                                  backgroundColor: '#17a2b8',
                                  color: 'white',
                                  padding: '8px 12px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  margin: '0 2px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Atendimento já realizado"
                              >
                                ✅ Atendido
                              </span>
                            )}
                            
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(agendamento)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(agendamento.idagendamento)} />
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
              <h2>{agendamentoAtual.idagendamento ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  
                  <div>
                    <label>Data *</label>
                    <input
                      name="data"
                      type="date"
                      value={agendamentoAtual.data}
                      onChange={handleChange}
                      min={getDataMinima()}
                      required
                    />
                  </div>

                  <div>
                    <label>Horário *</label>
                    <select
                      name="hora"
                      value={agendamentoAtual.hora}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o horário</option>
                      {getHorariosDisponiveis().map((horario) => (
                        <option key={horario} value={horario}>
                          {horario}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Usuário/Paciente *</label>
                    <select
                      name="idusuario"
                      value={agendamentoAtual.idusuario}
                      onChange={handleChange}
                      required
                      disabled={usuarioLogado && usuarioLogado.tipo === 1} // Desabilitar se for usuário comum (tipo = 1)
                    >
                      <option value="">Selecione o usuário</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.idusuario} value={usuario.idusuario}>
                          {usuario.login}
                        </option>
                      ))}
                    </select>
                    {usuarioLogado && usuarioLogado.tipo === 1 && (
                      <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        Usuários podem criar agendamentos apenas para si mesmos
                      </small>
                    )}
                  </div>

                  <div>
                    <label>Profissional *</label>
                    <select
                      name="idprofissional"
                      value={agendamentoAtual.idprofissional}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o profissional</option>
                      {profissionais.map((profissional) => (
                        <option key={profissional.idprofissional} value={profissional.idprofissional}>
                          {profissional.especialidade} - {profissional.loginUsuario}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Tratamento (Opcional)</label>
                    <select
                      name="idtratamento"
                      value={agendamentoAtual.idtratamento}
                      onChange={handleChange}
                    >
                      <option value="">Selecione um tratamento (opcional)</option>
                      {tratamentos.map((tratamento) => (
                        <option key={tratamento.idtratamento} value={tratamento.idtratamento}>
                          {tratamento.nometratamento}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Descrição/Observações</label>
                    <textarea
                      name="descricao"
                      value={agendamentoAtual.descricao}
                      onChange={handleChange}
                      placeholder="Observações sobre o agendamento..."
                      rows="3"
                      style={{ width: '100%', resize: 'vertical' }}
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

        {/* Modal para criar atendimento */}
        {mostrarFormularioAtendimento && (
          <div className="modal-overlay">
            <div className="modal-container" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={() => setMostrarFormularioAtendimento(false)}>×</button>
              <h2>Criar Atendimento</h2>
              
              {/* Informações do Agendamento */}
              {agendamentoParaAtender && (
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '6px', 
                  marginBottom: '20px',
                  border: '1px solid #dee2e6' 
                }}>
                  <h4 style={{ marginBottom: '10px', color: '#495057' }}>Informações do Agendamento</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div><strong>Data/Hora:</strong> {formatarDataHorario(agendamentoParaAtender.datahorario)}</div>
                    <div><strong>Paciente:</strong> {agendamentoParaAtender.nomeUsuario}</div>
                    <div><strong>Profissional:</strong> {agendamentoParaAtender.nomeProfissional}</div>
                    <div><strong>Tratamento:</strong> {agendamentoParaAtender.nomeTratamento || 'Não especificado'}</div>
                    {agendamentoParaAtender.descricao && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Observações do Agendamento:</strong> {agendamentoParaAtender.descricao}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitAtendimento}>
                
                <div style={{ marginBottom: '20px' }}>
                  <label>Data e Hora do Atendimento *</label>
                  <input
                    name="data"
                    type="datetime-local"
                    value={atendimentoAtual.data}
                    onChange={handleChangeAtendimento}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label>Status do Atendimento *</label>
                  <select
                    name="status"
                    value={atendimentoAtual.status}
                    onChange={handleChangeAtendimento}
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
                    onChange={handleChangeAtendimento}
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

                <div className="form-acoes" style={{ marginTop: '20px' }}>
                  <BotaoComIcone tipo="salvar" texto="Criar Atendimento" type="submit" />
                  <BotaoComIcone tipo="excluir" texto="Cancelar" onClick={() => setMostrarFormularioAtendimento(false)} />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Agendamentos;