const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_ACCOUNT':
            const newAccount = {
                email: action.payload.email,
                firstName: action.payload.firstName,
                surName: action.payload.surName,
                gender: action.payload.gender,
                password: action.payload.password,
            };
            const updatedAccounts = [...state.registeredAccounts, newAccount];
            localStorage.setItem("registeredAccounts", JSON.stringify(updatedAccounts));
            return {
                ...state,
                ...newAccount,
                isLoggedIn: true,
                registeredAccounts: updatedAccounts,
            }
        case 'LOGIN_USER':
            const accountExists = state.registeredAccounts.find(
                acc => acc.email === action.payload.email && acc.password === action.payload.password
            );
            if (accountExists) {
                localStorage.setItem("currUser", JSON.stringify(accountExists));
                return {
                    ...state,
                    ...accountExists,
                    isLoggedIn: true,
                }
            } else {
                throw new Error("Account not found. Please create an account first.");
            }
        case 'LOGOUT_USER':
            localStorage.removeItem("currUser");
            return {
                firstname: "",
                surName: "",
                gender: "",
                email: "",
                isLoggedIn: false,
                registeredAccounts: state.registeredAccounts,
            }
        default:
            break;
    }
}

export default AuthReducer;