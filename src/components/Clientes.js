import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarClientes, excluirCliente, salvarCliente } from '../services/clienteApi';
import { format, parseISO } from 'date-fns';
import BotaoComIcone from './BotaoComIcone';
import '../css/paginasComuns.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteAtual, setClienteAtual] = useState({
    codigo: '',
    nome: '',
    telefone: '',
    dataNascimento: '',
    foto: null,
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const data = await listarClientes();
      setClientes(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar clientes', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteAtual({ ...clienteAtual, [name]: value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setClienteAtual({ ...clienteAtual, foto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarCliente(clienteAtual);
      setMensagem({ texto: 'Cliente salvo com sucesso!', tipo: 'sucesso' });
      setMostrarFormulario(false);
      setClienteAtual({ codigo: '', nome: '', telefone: '', dataNascimento: '', foto: null });
      carregarClientes();
    } catch {
      setMensagem({ texto: 'Erro ao salvar cliente', tipo: 'erro' });
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este cliente?')) {
      try {
        await excluirCliente(id);
        setMensagem({ texto: 'Cliente excluído com sucesso!', tipo: 'sucesso' });
        carregarClientes();
      } catch {
        setMensagem({ texto: 'Erro ao excluir cliente', tipo: 'erro' });
      }
    }
  };

  const handleEditar = (cliente) => {
    const dataNascFormatada = cliente.dataNascimento ? format(new Date(cliente.dataNascimento), 'yyyy-MM-dd') : '';
    setClienteAtual({ ...cliente, dataNascimento: dataNascFormatada });
    setMostrarFormulario(true);
  };

  const formatarData = (data) => {
    if (!data) return '';
    try {
      return format(parseISO(data), 'dd/MM/yyyy');
    } catch {
      return data;
    }
  };

  return (
    <>
      <Menu />
      <div className="pagina-container">
        <main className="conteudo" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="pagina-header">
            <h1>Gestão de Clientes</h1>
            <BotaoComIcone
              tipo="adicionar"
              texto="Novo Cliente"
              onClick={() => {
                setClienteAtual({ codigo: '', nome: '', telefone: '', dataNascimento: '', foto: null });
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
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Telefone</th>
                      <th>Nascimento</th>
                      <th>Foto</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td>{cliente.codigo}</td>
                        <td>{cliente.nome}</td>
                        <td>{cliente.telefone}</td>
                        <td>{formatarData(cliente.dataNascimento)}</td>
                        <td>
                          {cliente.foto && (
                            <img
                              src={`data:image/jpeg;base64,${cliente.foto}`}
                              alt={cliente.nome}
                              style={{ width: 50, height: 50, borderRadius: 4 }}
                            />
                          )}
                        </td>
                        <td>
                          <div className="acoes">
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(cliente)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(cliente.id)} />
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
              <h2>{clienteAtual.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <form onSubmit={handleSubmit}>
                <label>Código</label>
                <input
                  name="codigo"
                  type="number"
                  value={clienteAtual.codigo}
                  onChange={handleChange}
                  required
                />

                <label>Nome</label>
                <input
                  name="nome"
                  value={clienteAtual.nome}
                  onChange={handleChange}
                  required
                />

                <label>Telefone</label>
                <input
                  name="telefone"
                  value={clienteAtual.telefone}
                  onChange={handleChange}
                  required
                />

                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={clienteAtual.dataNascimento}
                  onChange={handleChange}
                  required
                />

                <label>Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
                {clienteAtual.foto && (
                  <div className="foto-preview">
                    <img
                      src={`data:image/jpeg;base64,${clienteAtual.foto}`}
                      alt="Preview"
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                    />
                  </div>
                )}

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

export default Clientes;
