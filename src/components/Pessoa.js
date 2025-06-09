import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarPessoas, excluirPessoa, salvarPessoa } from '../services/pessoaApi';
import { listarUsuarios } from '../services/usuarioApi';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Pessoas = () => {
  const [pessoas, setPessoas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pessoaAtual, setPessoaAtual] = useState({
    cpf: '',
    nomecompleto: '',
    datanascimento: '',
    sexo: '',
    endereco: '',
    cep: '',
    cidade: '',
    uf: '',
    email: '',
    celular: '',
    contatoemergencia: '',
    nomecontatoemergencia: '',
    contatopreferencial: '',
    idusuario: '' // Para vincular com usuário
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [pessoasData, usuariosData] = await Promise.all([
        listarPessoas(),
        listarUsuarios()
      ]);
      setPessoas(pessoasData);
      setUsuarios(usuariosData);
    } catch {
      setMensagem({ texto: 'Erro ao carregar dados', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      const data = await listarPessoas();
      setPessoas(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar pessoas', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPessoaAtual({ ...pessoaAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarPessoa(pessoaAtual);
      setMensagem({ texto: 'Pessoa salva com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      limparFormulario();
      carregarPessoas();
    } catch (error) {
      setMensagem({ texto: error.message || 'Erro ao salvar pessoa', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir esta pessoa?')) {
      try {
        await excluirPessoa(id);
        setMensagem({ texto: 'Pessoa excluída com sucesso!', tipo: 'sucesso' });
        carregarPessoas();
      } catch {
        setMensagem({ texto: 'Erro ao excluir pessoa', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (pessoa) => {
    setPessoaAtual({
      idpessoa: pessoa.idpessoa,
      cpf: pessoa.cpf || '',
      nomecompleto: pessoa.nomecompleto || '',
      datanascimento: pessoa.datanascimento || '',
      sexo: pessoa.sexo || '',
      endereco: pessoa.endereco || '',
      cep: pessoa.cep || '',
      cidade: pessoa.cidade || '',
      uf: pessoa.uf || '',
      email: pessoa.email || '',
      celular: pessoa.celular || '',
      contatoemergencia: pessoa.contatoemergencia || '',
      nomecontatoemergencia: pessoa.nomecontatoemergencia || '',
      contatopreferencial: pessoa.contatopreferencial || '',
      idusuario: pessoa.idusuario || ''
    });
    setMostrarFormulario(true);
  };

  const limparFormulario = () => {
    setPessoaAtual({
      cpf: '',
      nomecompleto: '',
      datanascimento: '',
      sexo: '',
      endereco: '',
      cep: '',
      cidade: '',
      uf: '',
      email: '',
      celular: '',
      contatoemergencia: '',
      nomecontatoemergencia: '',
      contatopreferencial: '',
      idusuario: ''
    });
  };

  const formatarCPF = (cpf) => {
    return cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
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
            <h1>Gestão de Pessoas</h1>
            <BotaoComIcone
              tipo="adicionar"
              texto="Nova Pessoa"
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
                      <th>Nome Completo</th>
                      <th>CPF</th>
                      <th>Email</th>
                      <th>Celular</th>
                      <th>Cidade/UF</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pessoas.map((pessoa) => (
                      <tr key={pessoa.idpessoa}>
                        <td>{pessoa.nomecompleto}</td>
                        <td>{formatarCPF(pessoa.cpf)}</td>
                        <td>{pessoa.email}</td>
                        <td>{formatarTelefone(pessoa.celular)}</td>
                        <td>{pessoa.cidade}/{pessoa.uf}</td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(pessoa)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(pessoa.idpessoa)} />
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
            <div className="modal-container" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={() => setMostrarFormulario(false)}>×</button>
              <h2>{pessoaAtual.idpessoa ? 'Editar Pessoa' : 'Nova Pessoa'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  
                  <div>
                    <label>Nome Completo *</label>
                    <input
                      name="nomecompleto"
                      type="text"
                      value={pessoaAtual.nomecompleto}
                      onChange={handleChange}
                      required
                      placeholder="Nome completo da pessoa"
                    />
                  </div>

                  <div>
                    <label>CPF *</label>
                    <input
                      name="cpf"
                      type="text"
                      value={pessoaAtual.cpf}
                      onChange={handleChange}
                      required
                      placeholder="000.000.000-00"
                      maxLength="14"
                    />
                  </div>

                  <div>
                    <label>Data de Nascimento</label>
                    <input
                      name="datanascimento"
                      type="date"
                      value={pessoaAtual.datanascimento}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Sexo</label>
                    <select
                      name="sexo"
                      value={pessoaAtual.sexo}
                      onChange={handleChange}
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Endereço</label>
                    <input
                      name="endereco"
                      type="text"
                      value={pessoaAtual.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div>
                    <label>CEP</label>
                    <input
                      name="cep"
                      type="text"
                      value={pessoaAtual.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      maxLength="9"
                    />
                  </div>

                  <div>
                    <label>Cidade</label>
                    <input
                      name="cidade"
                      type="text"
                      value={pessoaAtual.cidade}
                      onChange={handleChange}
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <label>UF</label>
                    <select
                      name="uf"
                      value={pessoaAtual.uf}
                      onChange={handleChange}
                    >
                      <option value="">Selecione</option>
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
                  </div>

                  <div>
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={pessoaAtual.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label>Celular</label>
                    <input
                      name="celular"
                      type="text"
                      value={pessoaAtual.celular}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      maxLength="15"
                    />
                  </div>

                  <div>
                    <label>Contato de Emergência</label>
                    <input
                      name="contatoemergencia"
                      type="text"
                      value={pessoaAtual.contatoemergencia}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      maxLength="15"
                    />
                  </div>

                  <div>
                    <label>Nome do Contato de Emergência</label>
                    <input
                      name="nomecontatoemergencia"
                      type="text"
                      value={pessoaAtual.nomecontatoemergencia}
                      onChange={handleChange}
                      placeholder="Nome do contato"
                    />
                  </div>

                  <div>
                    <label>Contato Preferencial</label>
                    <select
                      name="contatopreferencial"
                      value={pessoaAtual.contatopreferencial}
                      onChange={handleChange}
                    >
                      <option value="">Selecione</option>
                      <option value="email">Email</option>
                      <option value="celular">Celular</option>
                      <option value="emergencia">Contato de Emergência</option>
                    </select>
                  </div>

                  <div>
                    <label>Vincular a Usuário (Opcional)</label>
                    <select
                      name="idusuario"
                      value={pessoaAtual.idusuario}
                      onChange={handleChange}
                    >
                      <option value="">Nenhum usuário</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.idusuario} value={usuario.idusuario}>
                          {usuario.login}
                        </option>
                      ))}
                    </select>
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

export default Pessoas;