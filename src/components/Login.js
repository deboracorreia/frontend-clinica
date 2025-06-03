import React, { useState } from 'react';
import api from '../services/api';
import Menu from './Menu.js';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            alert('Login inválido!');
        }
    };


    return (
        <div className="pagina-container">
            <Menu />
            <main className="conteudo">
                <div className="login-container">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;