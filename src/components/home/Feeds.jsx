import { useCallback, useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import PostCard from "../common/PostCard";
import { usePostContext } from "../../context/PostContext";
import axios from "axios";
import { postsAPI } from "../../services/api";
import { EmptyState, ErrorState, FeedSkeleton } from "../common/UiStates";

const Feeds = () => {
  const { state, dispatch } = usePostContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeServerPost = (post) => ({
    id: post._id,
    kind: 'server',
    createdBy: `${post.author?.firstName || 'Unknown'} ${post.author?.surName || ''}`.trim(),
    createdAt: new Date(post.createdAt).toLocaleString(),
    postText: post.content,
    files: post.image ? [post.image] : [],
    likes: post.likes || [],
    likesCount: post.likes?.length || 0,
    likedByMe: false,
    comments: (post.comments || []).map((comment) => ({
      id: comment._id || `${post._id}-${comment.createdAt}`,
      author: comment.author,
      text: comment.text,
      createdAt: comment.createdAt,
    })),
    commentsCount: post.comments?.length || 0,
    optimistic: false,
  });

  const normalizePixabayPost = (item, index) => ({
    id: `pixabay-${index}`,
    kind: 'pixabay',
    createdBy: item.user || 'Pixabay User',
    createdAt: new Date().toLocaleString(),
    postText: item.tags,
    files: [item.webformatURL],
    likes: [],
    likesCount: Math.floor(Math.random() * 1200) + 35,
    likedByMe: false,
    comments: [],
    commentsCount: 0,
    optimistic: false,
  });

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    dispatch({ type: 'SET_POST_LOADING', payload: true });

    const [serverResult, pixabayResult] = await Promise.allSettled([
      postsAPI.getAllPosts(),
      axios.get(`https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=people&image_type=photo&per_page=8`),
    ]);

    const nextPosts = [];
    let nextError = '';

    if (serverResult.status === 'fulfilled') {
      nextPosts.push(...serverResult.value.data.map(normalizeServerPost));
    } else {
      nextError = 'Unable to load your feed right now.';
    }

    if (pixabayResult.status === 'fulfilled') {
      nextPosts.push(...pixabayResult.value.data.hits.map(normalizePixabayPost));
    } else if (!nextError) {
      nextError = 'Unable to load discovery posts right now.';
    }

    dispatch({ type: 'SET_POSTS', payload: nextPosts });
    dispatch({ type: 'SET_POST_ERROR', payload: nextError });
    setError(nextError);
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const allPosts = state.post;

  return (
    <div className="space-y-4">
      <CreatePost />
      {loading && <FeedSkeleton count={3} />}

      {!loading && error && allPosts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {!loading && !allPosts.length && !error && (
        <EmptyState
          title="Your feed is empty"
          description="Create the first post to start your timeline, or refresh to fetch discovery content."
          actionLabel="Refresh feed"
          onAction={loadFeed}
        />
      )}

      {!loading && error && !allPosts.length && (
        <ErrorState
          title="Feed unavailable"
          description={error}
          onRetry={loadFeed}
        />
      )}

      {!loading && allPosts.map((currPost) => (
        <PostCard key={currPost.id} postData={currPost} />
      ))}
    </div>
  );
};

export default Feeds;
