// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

import {BrowserRouter, Routes, Route, Navigate, createBrowserRouter, RouterProvider} from "react-router"

import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import {AuthPage, PersonalPage, SharePage} from "./page/index.js";

import {createTheme, MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import '@mantine/spotlight/styles.css';
import "./index.css";
import axios from "axios";
import {EmojiProvider} from "react-apple-emojis";
import emojiData from "./filtered.json"
import RootLayout from "./layout/RootLayout.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import {Dolphin} from "./components/Dolphin/Dolphin.jsx";
import {useUrlStore} from "./store/url.js";

const theme = createTheme({
    fontFamily: "Inter, sans-serif",
});

axios.defaults.baseURL = 'http://localhost:4000';
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
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
        element: <RootLayout/>,
        children: [
            {path: 'login', element: <AuthPage/>},

            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        path: '/',
                        element: <DashboardLayout/>,
                        children: [
                            {
                                index: true,
                                element: <PersonalPage/>,
                                // Initialize the breadcrumb path for the root directory
                                loader: () => {
                                    useUrlStore.setState({path: [{id: null, name: 'Личный диск'}]})
                                    return null
                                }
                            },
                            {path: 'share', element: <SharePage/>},
                            {path: 'private-example', element: <div>privat</div>},
                        ],
                    },
                ],
            },

            {path: '*', element: <Navigate to='/' replace/>},
        ],
    },
]);
ReactDOM.createRoot(root).render(
    <MantineProvider theme={theme}>
        <EmojiProvider data={emojiData}>
            <RouterProvider router={router}/>
        </EmojiProvider>
    </MantineProvider>
);