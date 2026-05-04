import { AuthContext } from "../auth.context.jsx";
import { useContext } from "react";


export function useAuth(){

    const context = useContext(AuthContext)

    return context
}