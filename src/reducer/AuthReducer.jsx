const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'REGISTER_USER':
            return {
                ...state,
                email: action.payload.email,
                firstName: action.payload.firstName,
                surName: action.payload.surName,
                gender : action.payload.gender,
            }
        default:
            break;
    }
}

export default AuthReducer;