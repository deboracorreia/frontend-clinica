import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PaginaInicial from './components/PaginaInicial';
import Usuarios from './components/Usuarios';
import Pessoas from './components/Pessoa';
import { isAuthenticated } from './services/auth';
import Profissionais from './components/Profissional';
import Agendamento from './components/Agendamento';
import Atendimentos from './components/Atendimento';
import Tratamentos from './components/Tratamento';

// Componente para rotas protegidas básicas (apenas autenticação)
const RotaProtegida = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Componente para rotas que requerem tipo específico de usuário
const RotaComPermissao = ({ children, requiredUserType = null }) => {
    // Primeiro verifica se está autenticado
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    // Se não há restrição de tipo, permite acesso
    if (requiredUserType === null) {
        return children;
    }

    // Verifica o tipo de usuário
    const usuarioLogado = localStorage.getItem('usuario');
    
    try {
        const usuario = JSON.parse(usuarioLogado);
        
        // Se requer admin (0) e o usuário não é admin
        if (requiredUserType === 0 && usuario.tipo !== 0) {
            return <Navigate to="/agendamentos" replace />;
        }
        
        // Se requer user comum (1) e o usuário não é user comum
        if (requiredUserType === 1 && usuario.tipo !== 1) {
            return <Navigate to="/" replace />;
        }
        
        return children;
    } catch (error) {
        // Se erro ao parsear usuário, redireciona para login
        console.error('Erro ao verificar permissões do usuário:', error);
        return <Navigate to="/login" replace />;
    }
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota pública de login */}
                <Route path="/login" element={<Login />} />
                
                {/* Página inicial - acessível para qualquer usuário logado */}
                <Route path="/" element={
                    <RotaProtegida>
                        <PaginaInicial />
                    </RotaProtegida>
                } />
                
                {/* Rotas apenas para ADMINISTRADORES (tipo 0) */}
                <Route path="/usuarios" element={
                    <RotaComPermissao requiredUserType={0}>
                        <Usuarios />
                    </RotaComPermissao>
                } />

                <Route path="/pessoas" element={
                    <RotaComPermissao requiredUserType={0}>
                        <Pessoas />
                    </RotaComPermissao>
                } />

                <Route path="/profissionais" element={
                    <RotaComPermissao requiredUserType={0}>
                        <Profissionais />
                    </RotaComPermissao>
                } />

                <Route path="/atendimentos" element={
                    <RotaComPermissao requiredUserType={0}>
                        <Atendimentos />
                    </RotaComPermissao>
                } />

                <Route path="/tratamentos" element={
                    <RotaComPermissao requiredUserType={0}>
                        <Tratamentos />
                    </RotaComPermissao>
                } />

                {/* Agendamentos - acessível para TODOS os usuários logados */}
                <Route path="/agendamentos" element={
                    <RotaProtegida>
                        <Agendamento />
                    </RotaProtegida>
                } />

                {/* Rota catch-all - redireciona para página inicial */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;