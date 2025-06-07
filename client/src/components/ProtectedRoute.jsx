// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    // Если не аутентифицирован — редиректим на /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Иначе рендерим «вложенные» маршруты (Outlet)
    return <Outlet />;
}
