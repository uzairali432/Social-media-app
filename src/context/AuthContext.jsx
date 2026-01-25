import { createContext, useContext, useReducer, useEffect, useState } from "react";
import reducer from '../reducer/AuthReducer'
import { authAPI } from '../services/api';

const defaultValue = {
    userId: "",
    firstName: "",
    surName: "",
    email: "",
    token: localStorage.getItem("authToken") || "",
    isLoggedIn: !!localStorage.getItem("authToken"),
    loading: true,
}

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue)
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser();
                    dispatch({
                        type: 'SET_USER',
                        payload: {
                            ...response.data.user,
                            token
                        }
                    });
                } catch (error) {
                    console.error("Error fetching current user:", error);
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("refreshToken");
                    dispatch({ type: 'LOGOUT_USER' });
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useAuthContext = () => {
    return useContext(AuthContext)
}


