// src/page/auth/index.jsx
import React, { useState } from 'react';
import {
    Button,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
    Alert,
} from '@mantine/core';
import classes from './index.module.css';
import { useAuth } from '../../context/AuthContext';

export default function AuthPage() {
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Пожалуйста, введите и логин, и пароль.');
            return;
        }

        try {
            await login(username, password);
            // Если login успешен, navigate уже вызван внутри login()
        } catch (err) {
            setError('Неправильные логин или пароль.');
        }
    };

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} padding="xl">
                <Title order={2} className={classes.title}>
                    Welcome back to ShareChain!
                </Title>

                {error && (
                    <Alert color="red" mb="md">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Введите username"
                        placeholder="admin"
                        size="md"
                        radius="md"
                        value={username}
                        onChange={(e) => setUsername(e.currentTarget.value)}
                    />
                    <PasswordInput
                        label="Введите пароль"
                        placeholder="Твой пароль"
                        mt="md"
                        size="md"
                        radius="md"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                    <Button fullWidth mt="xl" size="md" radius="md" type="submit">
                        Войти
                    </Button>
                </form>
            </Paper>
        </div>
    );
}
