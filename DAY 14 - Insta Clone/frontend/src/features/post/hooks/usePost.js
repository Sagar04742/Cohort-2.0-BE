import { createPost, getFeed, likePost, unlikePost } from "../services/post.api";
import { PostContext } from "../post.context";
import { useContext, useEffect } from "react";

export const usePost = () => {
  const context = useContext(PostContext);
  const { loading, feed, post, setFeed, setLoading, setPost } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setFeed(data.posts ?? []);
    } catch (error) {
      console.error("Error loading feed:", error);
      setFeed([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    try {
      const data = await createPost(imageFile, caption);
      const newPost = data.post;
      setFeed([newPost, ...(feed ?? [])]);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (postId, isLiked) => {
    setLoading(true);
    try {
      const response = isLiked ? await unlikePost(postId) : await likePost(postId);
      setFeed((previousFeed) =>
        previousFeed.map((item) =>
          item._id === postId
            ? {
                ...item,
                isLiked: !isLiked,
                likeCount: response.likeCount ?? item.likeCount ?? 0,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, feed, post, handleGetFeed, handleCreatePost, handleToggleLike };
};