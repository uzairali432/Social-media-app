import { createContext, useContext } from "react";

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {
    return (
        <AppContext >
            {children}
        </AppContext>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}
export default AppProvider;