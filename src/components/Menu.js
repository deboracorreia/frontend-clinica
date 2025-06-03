import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/menu.css';

const Menu = () => {
    const [menuAberto, setMenuAberto] = useState(false);
    const location = useLocation();

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const logout = () => {
        // Remover token ou outras credenciais
        localStorage.removeItem('token');
        // Fechar o menu se estiver aberto
        setMenuAberto(false);
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
                <li>
                    <Link 
                        to="/usuarios" 
                        className={location.pathname === "/usuarios" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Usuários
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/pessoas" 
                        className={location.pathname === "/pessoas" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Pessoas
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/profissionais" 
                        className={location.pathname === "/profissionais" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Profissionais
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/agendamentos" 
                        className={location.pathname === "/agendamentos" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Agendamentos
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/atendimentos" 
                        className={location.pathname === "/atendimentos" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Atendimentos
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/tratamentos" 
                        className={location.pathname === "/tratamentos" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Tratamentos
                    </Link>
                </li>
                <li className="login-out">
                    <Link to="/login" onClick={logout}>
                        Sair
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;