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
                <h1>Sistema</h1>
            </div>
            
            <div className={`menu-toggle ${menuAberto ? 'active' : ''}`} onClick={alternarMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <ul className={`menu-items ${menuAberto ? 'active' : ''}`}>
                <li>
                    <Link 
                        to="/clientes" 
                        className={location.pathname === "/clientes" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Cliente
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/produtos" 
                        className={location.pathname === "/produtos" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Produto
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/pedidos" 
                        className={location.pathname === "/pedidos" ? "active" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Pedido
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

export default Menu;