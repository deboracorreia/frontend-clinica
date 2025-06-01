import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import '../css/paginasComuns.css';
import {
  listarPedidos,
  salvarPedido,
  atualizarPedido,
  excluirPedido,
  excluirItemPedido
} from '../services/pedidoApi';
import api from '../services/api';
import BotaoComIcone from './BotaoComIcone';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarItens, setMostrarItens] = useState({});

  const [form, setForm] = useState({
    id: null,
    dataPedido: '',
    cliente: { id: '', nome: '' },
    valorTotalPedido: 0,
    idUsuario: '',
    itens: [],
  });

  const [itemForm, setItemForm] = useState({
    idProduto: '',
    nomeProduto: '',
    qtd: '',
    valorUnitario: '',
    valorTotalItem: '',
  });

  useEffect(() => {
    carregarPedidos();
    carregarClientes();
    carregarProdutos();
    const user = JSON.parse(localStorage.getItem('usuario'));
    if (user) setForm(prev => ({ ...prev, idUsuario: user.id }));
  }, []);

  const carregarPedidos = async () => {
    const resp = await listarPedidos();
    setPedidos(resp);
  };

  const carregarClientes = async () => {
    try {
      const resp = await api.get('/clientes');
      setClientes(resp.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };
  
  const carregarProdutos = async () => {
    try {
      const resp = await api.get('/produtos');
      setProdutos(resp.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };
  

  const abrirModal = (pedido = null) => {
    if (pedido) {
      setForm({ ...pedido });
    } else {
      const user = JSON.parse(localStorage.getItem('usuario'));
      setForm({ id: null, dataPedido: '', cliente: { id: '', nome: '' }, valorTotalPedido: 0, idUsuario: user?.id || '', itens: [] });
    }
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    const user = JSON.parse(localStorage.getItem('usuario'));
    setForm({ id: null, dataPedido: '', cliente: { id: '', nome: '' }, valorTotalPedido: 0, idUsuario: user?.id || '', itens: [] });
    setItemForm({ idProduto: '', nomeProduto: '', qtd: '', valorUnitario: '', valorTotalItem: '' });
  };

  const salvarPedidoHandler = async () => {
    const user = JSON.parse(localStorage.getItem('usuario')); // <- Garantir que esteja salvo
    const valorTotal = form.itens.reduce((total, item) => total + parseFloat(item.valorTotalItem || 0), 0);

    const pedido = {
      ...form,
      idCliente: form.cliente.id,
      idUsuario: user?.id, // <- Agora corretamente preenchido
      valorTotalPedido: valorTotal
    };

    console.log('Pedido enviado:', pedido);

    try {
      if (pedido.id) {
        await atualizarPedido(pedido.id, pedido);
      } else {
        await salvarPedido(pedido);
      }
      fecharModal();
      carregarPedidos();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      alert('Erro ao salvar pedido!');
    }
  };


  const excluirPedidoHandler = async (id) => {
    if (window.confirm('Deseja excluir este pedido?')) {
      await excluirPedido(id);
      carregarPedidos();
    }
  };

  const adicionarItem = () => {
    const produto = produtos.find(p => p.id === parseInt(itemForm.idProduto));
    const total = itemForm.qtd * itemForm.valorUnitario;
    const novoItem = { ...itemForm, nomeProduto: produto?.nome || '', valorTotalItem: total };
    const novaLista = [...form.itens, novoItem];
    const novoValorTotal = novaLista.reduce((acc, item) => acc + parseFloat(item.valorTotalItem || 0), 0);
    setForm({ ...form, itens: novaLista, valorTotalPedido: novoValorTotal });
    setItemForm({ idProduto: '', nomeProduto: '', qtd: '', valorUnitario: '', valorTotalItem: '' });
  };

  const removerItem = (index) => {
    const novaLista = [...form.itens];
    novaLista.splice(index, 1);
    const novoValorTotal = novaLista.reduce((acc, item) => acc + parseFloat(item.valorTotalItem || 0), 0);
    setForm({ ...form, itens: novaLista, valorTotalPedido: novoValorTotal });
  };

  return (
    <>
      <Menu />
      <div className="pagina-container">
        <main className="conteudo" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="pagina-header">
            <h1>Gestão de Pedidos</h1>
            <BotaoComIcone tipo="adicionar" texto="Novo Pedido" onClick={() => abrirModal()} />
          </div>

          <div className="card-conteudo">
            <div className="tabela-container">
              <table className="tabela-dados">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Usuário</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <React.Fragment key={p.id}>
                      <tr onClick={() => setMostrarItens({ ...mostrarItens, [p.id]: !mostrarItens[p.id] })}>
                        <td>{p.id}</td>
                        <td>{p.dataPedido}</td>
                        <td>{p.cliente?.nome}</td>
                        <td>{p.valorTotalPedido}</td>
                        <td>{p.idUsuario}</td>
                        <td>
                          <BotaoComIcone tipo="editar" texto="Editar" onClick={(e) => { e.stopPropagation(); abrirModal(p); }} />
                          <BotaoComIcone tipo="excluir" texto="Excluir" onClick={(e) => { e.stopPropagation(); excluirPedidoHandler(p.id); }} />
                        </td>
                      </tr>
                      {mostrarItens[p.id] && p.itens?.length > 0 && (
                        <tr>
                          <td colSpan="6">
                            <table style={{ width: '100%' }}>
                              <thead>
                                <tr>
                                  <th>Produto</th>
                                  <th>Qtd</th>
                                  <th>Unitário</th>
                                  <th>Total</th>
                                  <th>Ação</th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.itens.map((item, idx) => (
                                  <tr key={idx}>
                                    <td>{item.nomeProduto}</td>
                                    <td>{item.qtd}</td>
                                    <td>{item.valorUnitario}</td>
                                    <td>{item.valorTotalItem}</td>
                                    <td>
                                      <BotaoComIcone tipo="excluir" texto="Remover" onClick={() => excluirItemPedido(item.id)} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <button className="modal-close" onClick={fecharModal}>×</button>
              <h2>{form.id ? 'Editar Pedido' : 'Novo Pedido'}</h2>
              <label>Data do Pedido</label>
              <input type="date" value={form.dataPedido} onChange={e => setForm({ ...form, dataPedido: e.target.value })} />

              <label>Cliente</label>
              <select value={form.cliente.id} onChange={e => {
                const cliente = clientes.find(c => c.id === parseInt(e.target.value));
                setForm({ ...form, cliente: cliente || { id: '', nome: '' } });
              }}>
                <option value="">Selecione</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>

              <div className="usuario-logado-box">
                <label>Usuário Logado</label>
                <div className="usuario-logado-texto">
                  {JSON.parse(localStorage.getItem('usuario'))?.login || 'Usuário'}
                </div>
              </div>

              <input type="hidden" value={form.idUsuario} name="idUsuario" />


              <label>Valor Total</label>
              <input type="number" value={form.valorTotalPedido} readOnly />

              <hr />
              <h4>Itens</h4>
              <label>Produto</label>
              <select
                value={itemForm.idProduto}
                onChange={e => {
                  const idSelecionado = e.target.value;
                  const produtoSelecionado = produtos.find(p => p.id === parseInt(idSelecionado));

                  setItemForm({
                    ...itemForm,
                    idProduto: idSelecionado,
                    nomeProduto: produtoSelecionado?.descricao || '',
                    valorUnitario: produtoSelecionado?.valorUnitario || ''
                  });
                }}
              >
                <option value="">Selecione</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} - {p.descricao}
                  </option>
                ))}
              </select>


              <label>Quantidade</label>
              <input
                type="number"
                value={itemForm.qtd}
                onChange={e => {
                  const qtd = e.target.value;
                  const total = qtd && itemForm.valorUnitario ? (parseFloat(qtd) * parseFloat(itemForm.valorUnitario)) : '';
                  setItemForm({
                    ...itemForm,
                    qtd,
                    valorTotalItem: total
                  });
                }}
              />

              <label>Valor Unitário</label>
              <input
                type="number"
                value={itemForm.valorUnitario}
                onChange={e => {
                  const valorUnitario = e.target.value;
                  const total = itemForm.qtd && valorUnitario ? (parseFloat(itemForm.qtd) * parseFloat(valorUnitario)) : '';
                  setItemForm({
                    ...itemForm,
                    valorUnitario,
                    valorTotalItem: total
                  });
                }}
              />

              <p>
                <strong>Total:</strong>{' '}
                R$ {parseFloat(itemForm.valorTotalItem || 0).toFixed(2)}
              </p>


              <div className="adicionar-item">
                <BotaoComIcone tipo="adicionar" texto="Adicionar Item" onClick={adicionarItem} />
              </div>

              <ul className="itens-lista">
                {form.itens.map((item, idx) => (
                  <li key={idx}>
                    Produto: {item.nomeProduto} | Qtd: {item.qtd} | Valor: {item.valorUnitario} | Total: {item.valorTotalItem}
                    <button className="remover" onClick={() => removerItem(idx)}>Remover</button>
                  </li>
                ))}
              </ul>

              <div className="form-acoes">
                <BotaoComIcone tipo="salvar" texto="Salvar" onClick={salvarPedidoHandler} />
                <BotaoComIcone tipo="excluir" texto="Cancelar" onClick={fecharModal} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pedidos;
