import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { listarProdutos, salvarProduto, excluirProduto } from '../services/tratamentoApi';
import '../css/paginasComuns.css';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';
import BotaoComIcone from './BotaoComIcone';
import api from '../services/api';

const ProdutoSchema = Yup.object().shape({
  codigo: Yup.string().max(15, 'Máximo 15 caracteres').required('Obrigatório'),
  descricao: Yup.string().max(50, 'Máximo 50 caracteres').required('Obrigatório'),
  unidadeMedida: Yup.string().max(5, 'Máximo 5 caracteres').required('Obrigatório'),
  qtd: Yup.number()
    .transform((_, originalValue) => {
      const clean = String(originalValue).replace(/\./g, '').replace(',', '.');
      return clean.trim() === '' ? null : parseFloat(clean);
    })
    .nullable()
    .typeError('Deve ser um número')
    .min(0, 'Mínimo 0')
    .required('Obrigatório'),
  valorUnitario: Yup.number()
    .transform((_, originalValue) => {
      const clean = String(originalValue).replace(/\./g, '').replace(',', '.').replace('R$', '').trim();
      return clean === '' ? null : parseFloat(clean);
    })
    .nullable()
    .typeError('Deve ser um número')
    .min(0, 'Mínimo 0')
    .required('Obrigatório'),
  caminhoImagem: Yup.string()
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i, 'Formato inválido'),
});

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState({
    codigo: '',
    descricao: '',
    unidadeMedida: '',
    qtd: '',
    valorUnitario: '',
    caminhoImagem: ''
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await listarProdutos();
      setProdutos(data);
    } catch {
      setMensagem({ texto: 'Erro ao carregar produtos', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async id => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await excluirProduto(id);
        setMensagem({ texto: 'Produto excluído com sucesso!', tipo: 'sucesso' });
        carregarProdutos();
      } catch {
        setMensagem({ texto: 'Erro ao excluir produto', tipo: 'erro' });
      }
    }
  };

  const handleEditar = produto => {
    setProdutoAtual(produto);
    setMostrarFormulario(true);
  };

  return (
    <>
    <Menu />
    <div className="pagina-container" >
      
      <main className="conteudo" style={{ width: '100%', maxWidth: '1000px' }}>
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
            <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
          </div>
        )}

        {/* <div className="pagina-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '0.8rem 1.2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}> */}
        <div className="pagina-header">
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Gestão de Produtos</h1>
          <BotaoComIcone
            tipo="adicionar"
            texto="Adicionar Produto"
            onClick={() => {
              setProdutoAtual({
                codigo: '',
                descricao: '',
                unidadeMedida: '',
                qtd: '',
                valorUnitario: '',
                caminhoImagem: ''
              });
              setMostrarFormulario(true);
            }}
          />
        </div>

        
      {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-container">
              <button className="modal-close" onClick={() => setMostrarFormulario(false)}>×</button>
              <h2>{produtoAtual.id ? 'Editar Produto' : 'Novo Produto'}</h2>
              <Formik
                initialValues={produtoAtual}
                enableReinitialize
                validationSchema={ProdutoSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    await salvarProduto(values);
                    setMensagem({ texto: 'Produto salvo com sucesso!', tipo: 'sucesso' });
                    setMostrarFormulario(false);
                    resetForm();
                    carregarProdutos();
                  } catch {
                    setMensagem({ texto: 'Erro ao salvar produto', tipo: 'erro' });
                  }
                }}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <FormInput name="codigo" label="Código" />
                    <FormInput name="descricao" label="Descrição" />
                    <FormInput name="unidadeMedida" label="Unidade de Medida" />
                    <FormInput name="qtd" label="Quantidade" isNumber />
                    <FormInput name="valorUnitario" label="Valor Unitário" isMoney />
                    <FormInput name="caminhoImagem" label="Caminho da Imagem" />

                    <div className="form-grupo">
                      <label htmlFor="imagemUpload">Upload de Imagem</label>
                      <input
                        id="imagemUpload"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const response = await api.post('/produtos/upload', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' },
                            });
                            setFieldValue('caminhoImagem', response.data.caminho);
                            setMensagem({ texto: 'Imagem enviada com sucesso!', tipo: 'sucesso' });
                          } catch {
                            setMensagem({ texto: 'Erro ao enviar imagem', tipo: 'erro' });
                          }
                        }}
                      />
                      {values.caminhoImagem && (
                        <div className="foto-preview">
                          <img
                            src={values.caminhoImagem}
                            alt="Preview"
                            style={{ maxWidth: '150px', maxHeight: '150px' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-acoes">
                      <BotaoComIcone tipo="excluir" texto="Cancelar" onClick={() => setMostrarFormulario(false)} />
                      <BotaoComIcone tipo="salvar" texto="Salvar" type="submit" />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
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
                    <th>Descrição</th>
                    <th>Unidade</th>
                    <th>Qtd</th>
                    <th>Valor</th>
                    <th>Imagem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.length > 0 ? (
                    produtos.map(prod => (
                      <tr key={prod.id}>
                        <td>{prod.codigo}</td>
                        <td>{prod.descricao}</td>
                        <td>{prod.unidadeMedida}</td>
                        <td>{prod.qtd}</td>
                        <td>{prod.valorUnitario}</td>
                        <td>
                          {prod.caminhoImagem && (
                            <img
                              src={prod.caminhoImagem}
                              alt={prod.descricao}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                            />
                          )}
                        </td>
                        <td>
                          <div className="acoes" style={{ display: 'flex', gap: '8px' }}>
                            <BotaoComIcone tipo="editar" texto="Editar" onClick={() => handleEditar(prod)} />
                            <BotaoComIcone tipo="excluir" texto="Excluir" onClick={() => handleExcluir(prod.id)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="sem-dados">Nenhum produto encontrado</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default Produtos;
