import { useMemo, useState } from 'react';
import { Avatar, Card, CardContent, CardHeader, Typography, ImageList, ImageListItem, TextField, Button } from '@mui/material';
import { MessageCircle, Send, ThumbsUp } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { usePostContext } from '../../context/PostContext';
import { postsAPI } from '../../services/api';

const PostCard = ({ postData }) => {
  const [commentText, setCommentText] = useState('');
  const [feedback, setFeedback] = useState('');
  const { state: authState } = useAuthContext();
  const { dispatch } = usePostContext();

  const currentUser = useMemo(() => ({
    _id: authState.userId,
    firstName: authState.firstName,
    surName: authState.surName,
  }), [authState.firstName, authState.surName, authState.userId]);

  const imageCount = postData.files?.length || 0;
  const likesCount = postData.likesCount ?? postData.likes?.length ?? 0;
  const comments = postData.comments || [];
  const commentsCount = postData.commentsCount ?? comments.length;
  const likedByMe = Boolean(postData.likedByMe);

  const getImageSrc = (file) => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  };

  const canPersist = postData.kind !== 'pixabay' && !String(postData.id).startsWith('temp-');

  const handleLike = async () => {
    if (!currentUser._id) return;

    const previousLikes = postData.likes || [];
    const previousLiked = likedByMe;
    const nextLiked = !previousLiked;

    dispatch({
      type: 'TOGGLE_LIKE_OPTIMISTIC',
      payload: {
        postId: postData.id,
        liked: nextLiked,
        user: currentUser,
      },
    });

    if (!canPersist) {
      return;
    }

    try {
      if (nextLiked) {
        await postsAPI.likePost(postData.id);
      } else {
        await postsAPI.unlikePost(postData.id);
      }
      setFeedback('');
    } catch (error) {
      dispatch({
        type: 'REVERT_LIKE',
        payload: {
          postId: postData.id,
          previousLiked,
          previousLikes,
        },
      });
      setFeedback(error.response?.data?.message || 'Unable to update like right now');
    }
  };

  const handleComment = async () => {
    const trimmedText = commentText.trim();
    if (!trimmedText || !currentUser._id) return;

    const tempComment = {
      id: `temp-comment-${Date.now()}`,
      author: currentUser,
      text: trimmedText,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    dispatch({
      type: 'ADD_COMMENT_OPTIMISTIC',
      payload: {
        postId: postData.id,
        comment: tempComment,
      },
    });

    setCommentText('');
    setFeedback('');

    if (!canPersist) {
      return;
    }

    try {
      const response = await postsAPI.commentPost(postData.id, trimmedText);
      dispatch({
        type: 'REPLACE_COMMENTS',
        payload: {
          postId: postData.id,
          comments: response.data.post.comments || [],
        },
      });
    } catch (error) {
      dispatch({
        type: 'REMOVE_COMMENT',
        payload: {
          postId: postData.id,
          commentId: tempComment.id,
        },
      });
      setFeedback(error.response?.data?.message || 'Unable to add comment right now');
    }
  };

  return (
    <div className="flex justify-center my-4">
      <Card sx={{ width: 650, borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#0866ff" }}>
              {postData.createdBy.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={postData.createdBy}
          subheader={postData.createdAt}
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {postData.postText}
          </Typography>
        </CardContent>

        {imageCount === 1 && (
          <img src={getImageSrc(postData.files[0])} alt="Post" className="w-full h-auto object-cover" />
        )}

        {imageCount === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {postData.files.map((file, i) => (
              <img key={i} src={getImageSrc(file)} alt={`Post ${i}`} className="w-full h-64 object-cover" />
            ))}
          </div>
        )}

        {imageCount >= 3 && (
          <ImageList sx={{ width: "100%", maxHeight: 500 }} cols={3} rowHeight={164}>
            {postData.files.map((file, i) => (
              <ImageListItem key={i}>
                <img
                  src={getImageSrc(file)}
                  alt={`Post ${i}`}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}

        <div className="px-4 pt-3 pb-2 flex items-center justify-between text-sm text-gray-500">
          <span>{likesCount} likes</span>
          <span>{commentsCount} comments</span>
        </div>

        {feedback && (
          <div className="mx-4 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {feedback}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-b px-4 py-2 text-sm font-medium text-gray-600">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${likedByMe ? 'text-[#0866ff]' : 'hover:text-[#0866ff]'}`}
          >
            <ThumbsUp size={16} fill={likedByMe ? 'currentColor' : 'none'} />
            {likedByMe ? 'Liked' : 'Like'}
          </button>
          <button type="button" className="flex items-center gap-2 rounded-full px-4 py-2 hover:text-[#0866ff]">
            <MessageCircle size={16} /> Comment
          </button>
        </div>

        <div className="px-4 py-3 space-y-3">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id || comment._id} className="rounded-2xl bg-gray-50 px-3 py-2 text-sm">
                <div className="font-semibold text-gray-800">
                  {comment.author?.firstName ? `${comment.author.firstName} ${comment.author.surName || ''}`.trim() : 'User'}
                </div>
                <div className="text-gray-600">{comment.text}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleComment}
              disabled={!commentText.trim()}
              sx={{ backgroundColor: '#0866ff', textTransform: 'none', minWidth: 0 }}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};


export default PostCard;
