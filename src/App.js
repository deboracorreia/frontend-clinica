import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PaginaInicial from './components/PaginaInicial';
import Usuarios from './components/Usuarios';
import Pessoas from './components/Pessoa';
import  Profissional from './components/Profissional';
import { isAuthenticated } from './services/auth';
import Profissionais from './components/Profissional';
import Agendamento from './components/Agendamento';
import Atendimentos from './components/Atendimento';
import Tratamentos from './components/Tratamento';

// Componente para rotas protegidas
const RotaProtegida = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <RotaProtegida>
                        <PaginaInicial />
                    </RotaProtegida>
                } />
                <Route path="/usuarios" element={
                    <RotaProtegida>
                        <Usuarios />
                    </RotaProtegida>
                } />

                <Route path="/pessoas" element={
                    <RotaProtegida>
                        <Pessoas />
                    </RotaProtegida>
                } />

                <Route path="/profissionais" element={
                    <RotaProtegida>
                        <Profissionais />
                    </RotaProtegida>
                } />

                <Route path="/agendamentos" element={
                    <RotaProtegida>
                        <Agendamento />
                    </RotaProtegida>
                } />

                {
                    <Route path="/atendimentos" element={
                        <RotaProtegida>
                            <Atendimentos />
                        </RotaProtegida>
                    } />
                }

                 {
                    <Route path="/tratamentos" element={
                        <RotaProtegida>
                            <Tratamentos />
                        </RotaProtegida>
                    } />
                }

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;