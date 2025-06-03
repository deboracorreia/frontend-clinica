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
                            <div className="icon">👤</div>
                            <h3>Usuários</h3>
                            <p>Gerenciamento de usuários do sistema</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">👥</div>
                            <h3>Pessoas</h3>
                            <p>Cadastro e controle de pessoas</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">👨‍⚕</div>
                            <h3>Profissionais</h3>
                            <p>Gestão de profissionais especializados</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">📅</div>
                            <h3>Agendamentos</h3>
                            <p>Controle de horários e agendamentos</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">🏥</div>
                            <h3>Atendimentos</h3>
                            <p>Registro e histórico de atendimentos</p>
                        </div>
                        
                        <div className="card">
                            <div className="icon">💊</div>
                            <h3>Tratamentos</h3>
                            <p>Acompanhamento de tratamentos</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaginaInicial;