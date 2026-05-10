import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";
import { useEffect } from "react";
import Nav from "../../shared/components/Nav";
import { useAuth } from "../../auth/hooks/useAuth";

const Feed = () => {
  const { feed, handleGetFeed, loading, handleToggleLike } = usePost();
  const { user } = useAuth();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading) {
    return (
      <main>
        <h1>Feed is loading</h1>
      </main>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <main>
        <Nav />
        <div className="empty-feed">
          <h1>No posts available</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="feed-page">
      <Nav />
      <div className="feed">
        <div className="posts">
          {feed.map((post) => (
            <Post
              key={post._id}
              user={post.user}
              post={post}
              currentUser={user}
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
