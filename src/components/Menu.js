import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/menu.css';
import logo from '../images/logo.png'; // Importar a logo

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
        // Forçar atualização da página para refletir o logout
        window.location.href = '/login';
    };

    return (
        <nav className="menu">
            <div className="logo">
                <Link to="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={logo} alt="Sorriso Pleno" className="logo-img" />
                </Link>
            </div>
            
            <div className={`menu-toggle ${menuAberto ? 'active' : ''}`} onClick={alternarMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`menu-items ${menuAberto ? 'active' : ''}`} style={{ display: 'flex', flexDirection: 'row' }}>
                {/* SOBRE - FORÇADO A SER PRIMEIRO */}
                <li className="sobre" style={{ order: -1000, flex: '0 0 auto' }}>
                    <Link 
                        to="/sobre" 
                        className={location.pathname === "/sobre" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Sobre
                    </Link>
                </li>

                {/* Usuários - só admin */}
                {usuario && usuario.tipo === 0 && (
                    <li style={{ order: 1, flex: '0 0 auto' }}>
                        <Link 
                            to="/usuarios" 
                            className={location.pathname === "/usuarios" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Usuários
                        </Link>
                    </li>
                )}

                {/* Pessoas - só admin */}
                {usuario && usuario.tipo === 0 && (
                    <li style={{ order: 2, flex: '0 0 auto' }}>
                        <Link 
                            to="/pessoas" 
                            className={location.pathname === "/pessoas" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Pessoas
                        </Link>
                    </li>
                )}

                {/* Profissionais - só admin */}
                {usuario && usuario.tipo === 0 && (
                    <li style={{ order: 3, flex: '0 0 auto' }}>
                        <Link 
                            to="/profissionais" 
                            className={location.pathname === "/profissionais" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Profissionais
                        </Link>
                    </li>
                )}

                {/* Agendamentos - todos logados */}
                {usuario && (
                    <li style={{ order: 4, flex: '0 0 auto' }}>
                        <Link 
                            to="/agendamentos" 
                            className={location.pathname === "/agendamentos" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            {usuario.tipo === 1 ? "Meus Agendamentos" : "Agendamentos"}
                        </Link>
                    </li>
                )}

                {/* Atendimentos - só admin */}
                {usuario && usuario.tipo === 0 && (
                    <li style={{ order: 5, flex: '0 0 auto' }}>
                        <Link 
                            to="/atendimentos" 
                            className={location.pathname === "/atendimentos" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Atendimentos
                        </Link>
                    </li>
                )}

                {/* Tratamentos - só admin */}
                {usuario && usuario.tipo === 0 && (
                    <li style={{ order: 6, flex: '0 0 auto' }}>
                        <Link 
                            to="/tratamentos" 
                            className={location.pathname === "/tratamentos" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Tratamentos
                        </Link>
                    </li>
                )}

                {/* Login/Sair - último */}
                {usuario ? (
                    <li className="login-out" style={{ order: 1000, flex: '0 0 auto' }}>
                        <button 
                            onClick={logout}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '10px 12px',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                textDecoration: 'none',
                                display: 'block'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Sair
                        </button>
                    </li>
                ) : (
                    <li className="login-in" style={{ order: 1000, flex: '0 0 auto' }}>
                        <Link 
                            to="/login"
                            className={location.pathname === "/login" ? "active" : ""}
                            onClick={() => setMenuAberto(false)}
                        >
                            Login
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Menu;