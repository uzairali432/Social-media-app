const updatePostById = (posts, postId, updater) => {
    return posts.map((post) => (post.id === postId ? updater(post) : post));
};

const PostReducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                post: action.payload,
                loading: false,
                error: null,
            };
        case 'SET_POST_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'SET_POST_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'ADD_POST_OPTIMISTIC':
            return {
                ...state,
                post: [action.payload, ...state.post],
            };
        case 'CONFIRM_POST':
            return {
                ...state,
                post: state.post.map((post) =>
                    post.id === action.payload.tempId
                        ? { ...action.payload.post, optimistic: false }
                        : post
                ),
            };
        case 'REMOVE_POST':
            return {
                ...state,
                post: state.post.filter((post) => post.id !== action.payload),
            };
        case 'TOGGLE_LIKE_OPTIMISTIC':
            return {
                ...state,
                post: updatePostById(state.post, action.payload.postId, (post) => ({
                    ...post,
                    likesCount: action.payload.liked
                        ? (post.likesCount || 0) + 1
                        : Math.max((post.likesCount || 0) - 1, 0),
                    likedByMe: action.payload.liked,
                    likes: action.payload.liked
                        ? [
                                ...(post.likes || []),
                                action.payload.user,
                            ]
                        : (post.likes || []).filter((like) => like._id !== action.payload.user._id),
                })),
            };
        case 'REVERT_LIKE':
            return {
                ...state,
                post: updatePostById(state.post, action.payload.postId, (post) => ({
                    ...post,
                    likesCount: action.payload.previousLiked
                        ? (post.likesCount || 0) + 1
                        : Math.max((post.likesCount || 0) - 1, 0),
                    likedByMe: action.payload.previousLiked,
                    likes: action.payload.previousLikes,
                })),
            };
        case 'ADD_COMMENT_OPTIMISTIC':
            return {
                ...state,
                post: updatePostById(state.post, action.payload.postId, (post) => ({
                    ...post,
                    comments: [...(post.comments || []), action.payload.comment],
                    commentsCount: (post.commentsCount || 0) + 1,
                })),
            };
        case 'REPLACE_COMMENTS':
            return {
                ...state,
                post: updatePostById(state.post, action.payload.postId, (post) => ({
                    ...post,
                    comments: action.payload.comments,
                    commentsCount: action.payload.comments.length,
                })),
            };
        case 'REMOVE_COMMENT':
            return {
                ...state,
                post: updatePostById(state.post, action.payload.postId, (post) => ({
                    ...post,
                    comments: (post.comments || []).filter((comment) => comment.id !== action.payload.commentId),
                    commentsCount: Math.max((post.commentsCount || 1) - 1, 0),
                })),
            };
        default:
            return state;
    }
};

export default PostReducer;