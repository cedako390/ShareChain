// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

// Создаём контекст
const AuthContext = createContext(null);

// Хук‐обёртка для удобного доступа
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // При монтировании проверим localStorage и, если есть токен, сразу запрашиваем /me
    useEffect(() => {
        const savedToken = localStorage.getItem('jwt_token');
        if (savedToken) {
            setToken(savedToken);
            axios
                .get('/me', {
                    headers: { Authorization: `Bearer ${savedToken}` },
                })
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    // Если /me вернул ошибку (например, токен просрочен), сбрасываем
                    localStorage.removeItem('jwt_token');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // Функция логина: вызывает /login, получает JWT, сохраняет, а затем запрашивает /me
    const login = async (username, password) => {
        try {
            const res = await axios.post(
                '/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const data = res.data;
            if (!data || !data.token) {
                throw new Error('Не получили токен');
            }

            localStorage.setItem('jwt_token', data.token);
            setToken(data.token);

            // Запрашиваем /me для полной информации о пользователе
            const meRes = await axios.get('/me', {
                headers: { Authorization: `Bearer ${data.token}` },
            });
            setUser(meRes.data);

            navigate('/');
        } catch (err) {
            throw new Error('invalid username or password');
        }
    };

    // Функция разлогина
    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
    };

    if (loading) {
        return null;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
