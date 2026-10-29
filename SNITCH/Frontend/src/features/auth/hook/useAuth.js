import { setUser } from "../state/auth.slice";
import { register, login, getMe } from "../services/auth.api";
import { useDispatch} from "react-redux";


export const useAuth = ()=>{

    const dispatch = useDispatch()

    async function handleRegister({email, fullname , password , contact , isSeller = false}) {
        const data = await register({email, fullname , password , contact , isSeller});

        dispatch(setUser(data.user));

    }

    async function handleLogin({email, password}) {
        const data = await login({email, password});

        dispatch(setUser(data.user));
    }

    async function handleGetMe() {
        try {
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch {
            // not logged in
            dispatch(setUser(null));
        }
    }

    return { handleRegister, handleLogin, handleGetMe }

}
