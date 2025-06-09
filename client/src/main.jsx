import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";
import axios from "axios";
import { EmojiProvider } from "react-apple-emojis";

import RootLayout from "./layout/RootLayout.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthPage, PersonalPage, SharePage } from "./page/index.js";
import { useUrlStore } from "./store/url.js";
import emojiData from "./filtered.json";

import "@mantine/core/styles.css";
import '@mantine/spotlight/styles.css';
import "./index.css";

const theme = createTheme({
    fontFamily: "Inter, sans-serif",
});

// Устанавливаем базовый URL для нашего API
axios.defaults.baseURL = 'http://localhost:4000';

// --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
// Модифицируем перехватчик запросов
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwt_token');

        // Проверяем, является ли URL запроса внутренним для нашего API
        // Запрос к MinIO будет иметь абсолютный URL, который не начинается с baseURL
        const isInternalApi = config.url.startsWith(axios.defaults.baseURL) || !config.url.startsWith('http');

        // Добавляем токен, только если это запрос к нашему API
        if (token && isInternalApi) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

const root = document.getElementById("root");

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: 'login', element: <AuthPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/',
                        element: <DashboardLayout />,
                        children: [
                            {
                                index: true,
                                element: <PersonalPage />,
                                loader: () => {
                                    useUrlStore.setState({ path: [{ id: null, name: 'Личный диск' }] });
                                    return null;
                                }
                            },
                            { path: 'share', element: <SharePage /> },
                            { path: 'private-example', element: <div>privat</div> },
                        ],
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(root).render(
    <MantineProvider theme={theme}>
        <EmojiProvider data={emojiData}>
            <RouterProvider router={router} />
        </EmojiProvider>
    </MantineProvider>
);