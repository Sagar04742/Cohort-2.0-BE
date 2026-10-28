import { setUser } from "../state/auth.slice";
import { register } from "../services/auth.api";
import { useDispatch} from "react-redux";


export const useAuth = ()=>{

    const dispatch = useDispatch()

    async function handleRegister({email, fullname , password , contact , isSeller = false}) {
        const data = await register({email, fullname , password , contact , isSeller});

        dispatch(setUser(data.user));
        
    }

    return { handleRegister}

}