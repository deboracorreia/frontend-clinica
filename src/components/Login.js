import React, { useState } from 'react';
import api from '../services/api';
import Menu from './Menu.js';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { salvarUsuario } from '../services/usuarioApi';
import '../css/login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState({
        login: '',
        senha: '',
        tipo: '1' // Usuário comum por padrão
    });
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data.token);

            // Buscar usuário autenticado
            const usuarioResp = await api.get('/usuarios/atual', {
                headers: {
                    Authorization: `Bearer ${response.data.token}`
                }
            });

            // Salvar usuário no localStorage
            localStorage.setItem('usuario', JSON.stringify(usuarioResp.data));

            navigate('/');
        } catch (error) {
            setMensagem({ texto: 'Login inválido!', tipo: 'erro' });
        }
    };

    const handleRegistroChange = (e) => {
        const { name, value } = e.target;
        setNovoUsuario({ ...novoUsuario, [name]: value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        try {
            await salvarUsuario(novoUsuario);
            setMensagem({ texto: 'Usuário registrado com sucesso! Faça login.', tipo: 'sucesso' });
            setMostrarRegistro(false);
            setNovoUsuario({ login: '', senha: '', tipo: '1' });
            // Limpar campos de login
            setUsername('');
            setPassword('');
        } catch (error) {
            const mensagemErro = error.response?.data?.mensagem || 
                               error.response?.data?.message || 
                               error.message || 
                               'Erro ao registrar usuário';
            setMensagem({ texto: mensagemErro, tipo: 'erro' });
        }
    };

    return (
        <div className="pagina-container">
            <Menu />
            <main className="conteudo">
                <div className="login-container">
                    {!mostrarRegistro ? (
                        <>
                            <h2>Login</h2>
                            
                            {mensagem.texto && (
                                <div className={`mensagem ${mensagem.tipo}`}>
                                    {mensagem.texto}
                                    <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <input 
                                    type="text" 
                                    placeholder="Usuário" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                                <input 
                                    type="password" 
                                    placeholder="Senha" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <button type="submit">Entrar</button>
                            </form>

                            <div className="registro-link">
                                <p>Não tem uma conta?</p>
                                <button 
                                    type="button" 
                                    className="btn-registro"
                                    onClick={() => setMostrarRegistro(true)}
                                >
                                    Registrar-se
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Criar Conta</h2>
                            
                            {mensagem.texto && (
                                <div className={`mensagem ${mensagem.tipo}`}>
                                    {mensagem.texto}
                                    <button onClick={() => setMensagem({ texto: '', tipo: '' })}>×</button>
                                </div>
                            )}

                            <form onSubmit={handleRegistro}>
                                <input
                                    name="login"
                                    type="text"
                                    placeholder="Nome de usuário"
                                    value={novoUsuario.login}
                                    onChange={handleRegistroChange}
                                    required
                                />
                                
                                <input
                                    name="senha"
                                    type="password"
                                    placeholder="Senha"
                                    value={novoUsuario.senha}
                                    onChange={handleRegistroChange}
                                    required
                                />

                                {/* <select
                                    name="tipo"
                                    value={novoUsuario.tipo}
                                    onChange={handleRegistroChange}
                                    required
                                >
                                    <option value="1">Usuário</option>
                                    <option value="0">Administrador</option>
                                </select> */}

                                <button type="submit">Registrar</button>
                            </form>

                            <div className="registro-link">
                                <p>Já tem uma conta?</p>
                                <button 
                                    type="button" 
                                    className="btn-registro"
                                    onClick={() => {
                                        setMostrarRegistro(false);
                                        setMensagem({ texto: '', tipo: '' });
                                    }}
                                >
                                    Fazer Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Login;