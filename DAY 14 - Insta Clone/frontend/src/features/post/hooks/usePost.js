import { getFeed } from "../services/post.api";
import { PostContext } from "../post.context";
import { useContext } from "react";

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

  return { loading, feed, post, handleGetFeed };
};