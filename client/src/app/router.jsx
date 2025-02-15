import {Route, Routes} from "react-router";
import LoginPage from "./auth/login.jsx";


export function Router() {
    return <Routes>
        <Route path="/" element={<div>hello world</div>}/>
        <Route path="auth">
            <Route path="login" element={<LoginPage />}/>
        </Route>
    </Routes>
}