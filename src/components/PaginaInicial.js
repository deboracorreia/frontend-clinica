import React from 'react';
import Menu from './Menu.js';
import '../css/paginaInicial.css';

const PaginaInicial = () => {
    return (
        <div className="pagina-container">
            <Menu />
            <main className="conteudo">
                <div className="bem-vindo">
                    <h1>Bem-vindo ao Sistema</h1>
                    <p>Selecione uma opção no menu acima para começar</p>
                    
                    <div className="cards-container">
                        <div className="card">
                            <div className="icon">👥</div>
                            <h3>Clientes</h3>
                            <p>Gerenciamento completo de clientes</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">📦</div>
                            <h3>Produtos</h3>
                            <p>Catálogo e estoque de produtos</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">🛒</div>
                            <h3>Pedidos</h3>
                            <p>Controle de vendas e pedidos</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaginaInicial;