import {api} from "@/utils/api.ts";
import {createContext, type ReactNode, useContext} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";

export interface AuthContextType {
    isAuthenticated: boolean;
    user: string | null;
    isLoading: boolean;
    login: (login: string, password: string) => Promise<void>;
}

const getMeFn = async () => {
    const {data} = await api.get("/auth/me");
    return data.data.sub as string;
};

const loginFn = async ({
                           login,
                           password,
                       }: { login: string; password: string }) => {
    await api.post("/auth/login", {login, password});
};

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: { children: ReactNode }) {
    const {data, refetch, isLoading} = useQuery({
        queryKey: ["me"],
        queryFn: getMeFn,
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false
    });

    const loginMutation = useMutation({
        mutationFn: loginFn,
        onSuccess: () => refetch()
    });

    const user = data ?? null;
    const isAuthenticated = Boolean(user);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user, isLoading,
            login: (l, p) => loginMutation.mutateAsync({login: l, password: p})
        }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}