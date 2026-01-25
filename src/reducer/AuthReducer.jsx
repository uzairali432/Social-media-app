const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_ACCOUNT':
            return {
                ...state,
                userId: action.payload.userId,
                firstName: action.payload.firstName,
                surName: action.payload.surName,
                email: action.payload.email,
                token: action.payload.token,
                isLoggedIn: true,
            };
        case 'LOGIN_USER':
            localStorage.setItem("authToken", action.payload.token);
            if (action.payload.refreshToken) {
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            }
            return {
                ...state,
                userId: action.payload.userId,
                firstName: action.payload.firstName,
                surName: action.payload.surName,
                email: action.payload.email,
                token: action.payload.token,
                isLoggedIn: true,
            };
        case 'SET_USER':
            return {
                ...state,
                userId: action.payload.userId,
                firstName: action.payload.firstName,
                surName: action.payload.surName,
                email: action.payload.email,
                token: action.payload.token,
                isLoggedIn: true,
            };
        case 'LOGOUT_USER':
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            return {
                userId: "",
                firstName: "",
                surName: "",
                email: "",
                token: "",
                isLoggedIn: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default AuthReducer;