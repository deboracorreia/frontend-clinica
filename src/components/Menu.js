import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/menu.css';

const Menu = () => {
    const [menuAberto, setMenuAberto] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Buscar usuário do localStorage
        const usuarioLogado = localStorage.getItem('usuario');
        if (usuarioLogado) {
            try {
                setUsuario(JSON.parse(usuarioLogado));
            } catch (error) {
                console.error('Erro ao parsear usuário do localStorage:', error);
            }
        }
    }, []);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const logout = () => {
        // Remover token e usuário
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        // Fechar o menu se estiver aberto
        setMenuAberto(false);
    };

    // Função para verificar se o usuário é administrador
    const isAdmin = () => {
        return usuario && usuario.tipo === 0;
    };

    // Função para verificar se o usuário é comum
    const isUser = () => {
        return usuario && usuario.tipo === 1;
    };

    return (
        <nav className="menu">
            <div className="logo">
                <Link to="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1>Sorriso Pleno</h1>
                </Link>
            </div>
            
            <div className={`menu-toggle ${menuAberto ? 'active' : ''}`} onClick={alternarMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`menu-items ${menuAberto ? 'active' : ''}`}>
                {/* Usuários - só para admin */}
                {isAdmin() && (
                    <li>
                        <Link 
                            to="/usuarios" 
                            className={location.pathname === "/usuarios" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Usuários
                        </Link>
                    </li>
                )}

                {/* Pessoas - só para admin */}
                {isAdmin() && (
                    <li>
                        <Link 
                            to="/pessoas" 
                            className={location.pathname === "/pessoas" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Pessoas
                        </Link>
                    </li>
                )}

                {/* Profissionais - só para admin */}
                {isAdmin() && (
                    <li>
                        <Link 
                            to="/profissionais" 
                            className={location.pathname === "/profissionais" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Profissionais
                        </Link>
                    </li>
                )}

                {/* Agendamentos - para todos */}
                <li>
                    <Link 
                        to="/agendamentos" 
                        className={location.pathname === "/agendamentos" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        {isUser() ? "Meus Agendamentos" : "Agendamentos"}
                    </Link>
                </li>

                {/* Atendimentos - só para admin */}
                {isAdmin() && (
                    <li>
                        <Link 
                            to="/atendimentos" 
                            className={location.pathname === "/atendimentos" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Atendimentos
                        </Link>
                    </li>
                )}

                {/* Tratamentos - só para admin */}
                {isAdmin() && (
                    <li>
                        <Link 
                            to="/tratamentos" 
                            className={location.pathname === "/tratamentos" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Tratamentos
                        </Link>
                    </li>
                )}

                <li className="login-out">
                    <Link to="/login" onClick={logout}>
                        Sair
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;