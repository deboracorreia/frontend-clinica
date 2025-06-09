import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
    const token = localStorage.getItem('token');
    const usuarioLogado = localStorage.getItem('usuario');
    
    // Se não tem token, redireciona para login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se não há restrição de tipo de usuário, permite acesso
    if (requiredUserType === null) {
        return children;
    }

    // Verifica o tipo de usuário
    try {
        const usuario = JSON.parse(usuarioLogado);
        
        // Se requiredUserType é 'admin' (0) e o usuário não é admin
        if (requiredUserType === 0 && usuario.tipo !== 0) {
            return <Navigate to="/agendamentos" replace />;
        }
        
        // Se requiredUserType é 'user' (1) e o usuário não é user comum
        if (requiredUserType === 1 && usuario.tipo !== 1) {
            return <Navigate to="/" replace />;
        }
        
        return children;
    } catch (error) {
        // Se erro ao parsear usuário, redireciona para login
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;