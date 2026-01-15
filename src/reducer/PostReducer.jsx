
 const  PostReducer = (state, action) =>{
    switch (action.type) {
        case 'ADD_POST':
            const data = action.payload;
            console.log(data, data)
            return {
                ...state,
                post : [action.payload, ...state.post]
            }
            break;
    
        default:
            break;
    }

}

export default PostReducer;