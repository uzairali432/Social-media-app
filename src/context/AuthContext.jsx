import { createContext, useContext, useReducer, useState } from "react";
import reducer from '../reducer/AuthReducer'

const defaultValue = {
    firstName: "",
    surName: "",
    gender: "",
    email: "",
    isLoggedIn: false,
    registeredAccounts: JSON.parse(localStorage.getItem("registeredAccounts")) || [],
}
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue)


    return <AuthContext.Provider value={{state, dispatch}}>{children}</AuthContext.Provider>

}
export default AuthProvider;

export const useAuthContext = () => {
    return useContext(AuthContext)
}

