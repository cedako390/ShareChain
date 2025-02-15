import { useState } from 'react';
import {useLogin} from "../../features/auth/services/login.js";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: login, isLoading, error } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
                Войти
            </button>
            {error && <p>Ошибка авторизации</p>}
        </form>
    );
};

export default LoginPage;
