import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import '../css/paginasComuns.css';

const AcessoNegado = () => {
    return (
        <>
            <Menu />
            <div className="pagina-container" style={{ paddingTop: '150px' }}>
                <main className="conteudo" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '80px' }}>
                    <div className="card-conteudo" style={{ textAlign: 'center', padding: '40px' }}>
                        <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
                            🚫 Acesso Negado
                        </h1>
                        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
                            Você não tem permissão para acessar esta página.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link 
                                to="/agendamentos" 
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}
                            >
                                Ir para Agendamentos
                            </Link>
                            <Link 
                                to="/" 
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}
                            >
                                Voltar ao Início
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AcessoNegado;