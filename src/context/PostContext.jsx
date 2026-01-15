import { createContext, useContext, useReducer } from "react";
import reducer from '../reducer/PostReducer'

const defaultValue = {
    post: []
}
const PostContext = createContext(defaultValue);

const PostContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue)

    return <PostContext.Provider value={{ state, dispatch }}>{children}</PostContext.Provider>
}


export default PostContextProvider;

export const usePostContext = () => {
    return useContext(PostContext)
}