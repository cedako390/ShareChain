import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router";
import {Router} from "./app/router.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    </QueryClientProvider>,
)
