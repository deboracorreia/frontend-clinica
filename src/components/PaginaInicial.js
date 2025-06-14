import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu.js';
import '../css/paginaInicial.css';

const PaginaInicial = () => {
    // Função para obter o tipo de usuário do localStorage ou contexto
    const getTipoUsuario = () => {
        try {
            const usuarioString = localStorage.getItem('usuario');
            if (!usuarioString) {
                console.log('Nenhum usuário encontrado no localStorage');
                return 2; // Se não há usuário logado, assume admin para teste
            }
            
            const usuario = JSON.parse(usuarioString);
            console.log('Usuário encontrado:', usuario);
            console.log('Tipo do usuário:', usuario.tipo);
            
            return usuario.tipo || 2; // Default para admin se tipo não definido
        } catch (error) {
            console.error('Erro ao ler usuário do localStorage:', error);
            return 2; // Em caso de erro, assume admin
        }
    };

    const tipoUsuario = getTipoUsuario();
    
    // Log para debug
    console.log('Tipo de usuário atual:', tipoUsuario);
    console.log('É usuário comum (tipo 1):', tipoUsuario === 1);
    console.log('Pode ver cards admin:', tipoUsuario !== 1);

    // Configuração dos cards com controle de visibilidade
    const cards = [
        {
            to: "/usuarios",
            icon: "👤",
            titulo: "Usuários",
            descricao: "Gerenciamento de usuários do sistema",
            visivel: tipoUsuario !== 1 // Oculto para usuário comum (tipo 1)
        },
        {
            to: "/pessoas",
            icon: "👥",
            titulo: "Pessoas",
            descricao: "Cadastro e controle de pessoas",
            visivel: tipoUsuario !== 1 // Oculto para usuário comum (tipo 1)
        },
        {
            to: "/profissionais",
            icon: "👨‍⚕️",
            titulo: "Profissionais",
            descricao: "Gestão de profissionais especializados",
            visivel: tipoUsuario !== 1 // Oculto para usuário comum (tipo 1)
        },
        {
            to: "/agendamentos",
            icon: "📅",
            titulo: "Agendamentos",
            descricao: "Controle de horários e agendamentos",
            visivel: true // Visível para todos os tipos de usuário
        },
        {
            to: "/atendimentos",
            icon: "🏥",
            titulo: "Atendimentos",
            descricao: "Registro e histórico de atendimentos",
            visivel: tipoUsuario !== 1 // Oculto para usuário comum (tipo 1)
        },
        {
            to: "/tratamentos",
            icon: "💊",
            titulo: "Tratamentos",
            descricao: "Acompanhamento de tratamentos",
            visivel: tipoUsuario !== 1 // Oculto para usuário comum (tipo 1)
        }
    ];

    // Filtrar apenas os cards visíveis
    const cardsVisiveis = cards.filter(card => card.visivel);

    return (
        <div className="pagina-container">
            <Menu />
            <main className="conteudo">
                <div className="bem-vindo">
                    <h1>Bem-vindo ao Sistema</h1>
                    {/* <p>Selecione uma opção no menu acima para começar</p> */}
                    
                    <div className="cards-container">
                        {cardsVisiveis.map((card, index) => (
                            <Link to={card.to} className="card-link" key={index}>
                                <div className="card">
                                    <div className="icon">{card.icon}</div>
                                    <h3>{card.titulo}</h3>
                                    <p>{card.descricao}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaginaInicial;