import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PaginaInicial from './components/PaginaInicial';
import Usuarios from './components/Usuarios';
import { isAuthenticated } from './services/auth';

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

                {/* {<Route path="/produtos" element={
                    <RotaProtegida>
                        <Produtos />
                    </RotaProtegida>
                } />
                }
                {
                    <Route path="/pedidos" element={
                        <RotaProtegida>
                            <Pedidos />
                        </RotaProtegida>
                    } />
                } */}

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;