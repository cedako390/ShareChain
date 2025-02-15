import axios from "axios";
import {useMutation} from "@tanstack/react-query";

const loginUser = async (credentials) => {
    const res = await axios.post('/api/login', credentials)
    return res.data
}

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
    })
}