import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { 
  salvarAtendimento,
  buscarAtendimento,
  STATUS_ATENDIMENTO,
  formatarStatus,
  formatarDataHorario
} from '../services/atendimentoApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const AtendimentoForm = () => {
  const [atendimentoAtual, setAtendimentoAtual] = useState({
    idagendamento: '',
    descricao: '',
    data: '',
    status: STATUS_ATENDIMENTO.EM_ANDAMENTO
  });
  const [agendamentoInfo, setAgendamentoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isEdicao, setIsEdicao] = useState(false);

  useEffect(() => {
    // Verificar se há um agendamento para atender (vindo da tela de agendamentos)
    const agendamentoParaAtender = localStorage.getItem('agendamentoParaAtender');
    if (agendamentoParaAtender) {
      const agendamento = JSON.parse(agendamentoParaAtender);
      setAgendamentoInfo(agendamento);
      setAtendimentoAtual(prev => ({
        ...prev,
        idagendamento: agendamento.idagendamento,
        data: new Date().toISOString().slice(0, 16) // Formato datetime-local
      }));
      localStorage.removeItem('agendamentoParaAtender');
    }

    // Verificar se há um atendimento para editar
    const atendimentoParaEditar = localStorage.getItem('atendimentoParaEditar');
    if (atendimentoParaEditar) {
      const atendimento = JSON.parse(atendimentoParaEditar);
      setIsEdicao(true);
      setAtendimentoAtual({
        idatendimento: atendimento.idatendimento,
        idagendamento: atendimento.idagendamento,
        descricao: atendimento.descricao || '',
        data: atendimento.data ? new Date(atendimento.data).toISOString().slice(0, 16) : '',
        status: atendimento.status
      });
      
      // Montar informações do agendamento a partir do atendimento
      setAgendamentoInfo({
        idagendamento: atendimento.idagendamento,
        datahorario: atendimento.dataAgendamento,
        nomeUsuario: atendimento.nomeUsuario,
        nomeProfissional: atendimento.nomeProfissional,
        nomeTratamento: atendimento.nomeTratamento,
        descricao: atendimento.descricaoAgendamento
      });
      
      localStorage.removeItem('atendimentoParaEditar');
    }
  }, []);

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
      
      // Redirecionar após sucesso (pode usar React Router)
      setTimeout(() => {
        // window.location.href = '/atendimentos'; // ou usar navigate
        alert('Redirecionando para a lista de atendimentos...');
      }, 2000);
      
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao salvar atendimento', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    // Voltar para a lista de atendimentos
    // window.location.href = '/atendimentos'; // ou usar navigate
    alert('Voltando para a lista de atendimentos...');
  };

  return (
    <>
      <Menu />
      <div className="pagina-container" style={{ paddingTop: '150px' }}>
        <main className="conteudo" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '80px' }}>
          
          <div className="pagina-header">
            <h1>{isEdicao ? 'Editar Atendimento' : 'Novo Atendimento'}</h1>
            <BotaoComIcone
              tipo="voltar"
              texto="Voltar"
              onClick={handleVoltar}
            />
          </div>

          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>
              {mensagem.texto}
              <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
            </div>
          )}

          {/* Informações do Agendamento */}
          {agendamentoInfo && (
            <div className="card-conteudo" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: '#495057' }}>Informações do Agendamento</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px',
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '6px'
              }}>
                <div>
                  <strong>Data/Hora:</strong><br />
                  {formatarDataHorario(agendamentoInfo.datahorario)}
                </div>
                <div>
                  <strong>Paciente:</strong><br />
                  {agendamentoInfo.nomeUsuario}
                </div>
                <div>
                  <strong>Profissional:</strong><br />
                  {agendamentoInfo.nomeProfissional}
                </div>
                <div>
                  <strong>Tratamento:</strong><br />
                  {agendamentoInfo.nomeTratamento || 'Não especificado'}
                </div>
                {agendamentoInfo.descricao && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Observações do Agendamento:</strong><br />
                    {agendamentoInfo.descricao}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Formulário do Atendimento */}
          <div className="card-conteudo">
            <form onSubmit={handleSubmit}>
              
              <div style={{ marginBottom: '20px' }}>
                <label>Data e Hora do Atendimento *</label>
                <input
                  name="data"
                  type="datetime-local"
                  value={atendimentoAtual.data}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>Status do Atendimento *</label>
                <select
                  name="status"
                  value={atendimentoAtual.status}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                >
                  <option value={STATUS_ATENDIMENTO.EM_ANDAMENTO}>
                    {formatarStatus(STATUS_ATENDIMENTO.EM_ANDAMENTO)}
                  </option>
                  <option value={STATUS_ATENDIMENTO.CONCLUIDO}>
                    {formatarStatus(STATUS_ATENDIMENTO.CONCLUIDO)}
                  </option>
                  <option value={STATUS_ATENDIMENTO.CANCELADO}>
                    {formatarStatus(STATUS_ATENDIMENTO.CANCELADO)}
                  </option>
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
                  rows="8"
                  style={{ 
                    width: '100%', 
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Mínimo de 10 caracteres. Descreva detalhadamente o atendimento realizado.
                </small>
              </div>

              <div className="form-acoes" style={{ marginTop: '30px' }}>
                <BotaoComIcone 
                  tipo="salvar" 
                  texto={isEdicao ? "Atualizar Atendimento" : "Salvar Atendimento"} 
                  type="submit"
                  disabled={loading}
                />
                <BotaoComIcone 
                  tipo="excluir" 
                  texto="Cancelar" 
                  onClick={handleVoltar}
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default AtendimentoForm;