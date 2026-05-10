import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { useUser } from "../hooks/useUser";
import Nav from "../../shared/components/Nav";
import "../style/profile.scss";

const Profile = () => {
  const { user, handleLogout } = useAuth();
  const {
    profile,
    requests,
    lookup,
    statusMessage,
    loading,
    loadProfile,
    loadRequests,
    lookupUser,
    requestFollow,
    requestUnfollow,
    respondRequest,
    setStatusMessage,
  } = useUser();
  const [usernameToFollow, setUsernameToFollow] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    loadProfile();
    loadRequests();
  }, [user]);

  if (!user) {
    return (
      <main>
        <h1 className="empty-profile">Login to access your profile</h1>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Nav />
      <div className="profile-card">
        <div className="header">
          <img className="avatar" src={user.profileImage} alt={user.username} />
          <div className="user-meta">
            <h2>{user.username}</h2>
            <p>{user.bio || "Write a short bio to tell people more about you."}</p>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <strong>{profile?.stats?.postCount ?? 0}</strong>
            <span>Posts</span>
          </div>
          <div className="stat">
            <strong>{profile?.stats?.followersCount ?? 0}</strong>
            <span>Followers</span>
          </div>
          <div className="stat">
            <strong>{profile?.stats?.followingCount ?? 0}</strong>
            <span>Following</span>
          </div>
        </div>
        <div className="actions">
          <button onClick={() => navigate("/")}>View Feed</button>
          <button onClick={() => navigate("/create-post")}>Create Post</button>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
      </div>

      <div className="lookup-card">
        <h3>Follow a user</h3>
        <input
          placeholder="Enter username to follow"
          value={usernameToFollow}
          onChange={(e) => setUsernameToFollow(e.target.value)}
        />
        <div className="actions">
          <button
            onClick={() => {
              lookupUser(usernameToFollow.trim());
              setStatusMessage(null);
            }}
          >
            Lookup
          </button>
          <button
            onClick={() => requestFollow(usernameToFollow.trim())}
            disabled={!usernameToFollow.trim()}
          >
            Send Follow Request
          </button>
          <button
            onClick={() => requestUnfollow(usernameToFollow.trim())}
            disabled={!usernameToFollow.trim()}
          >
            Unfollow
          </button>
        </div>
        {lookup?.user && (
          <div className="lookup-result">
            <strong>{lookup.user.username}</strong>
            <p>{lookup.user.bio || "No bio available."}</p>
            <p>{lookup.stats.followersCount} followers · {lookup.stats.followingCount} following</p>
            <p>Status: {lookup.relation.followRequestStatus}</p>
          </div>
        )}
      </div>

      <div className="request-card">
        <h3>Pending follow requests</h3>
        <div className="requests">
          {requests.length === 0 && <p>No pending requests.</p>}
          {requests.map((request) => (
            <div key={request.id} className="request">
              <span>{request.follower}</span>
              <div className="actions">
                <button onClick={() => respondRequest(request.follower, "accepted")}>Accept</button>
                <button onClick={() => respondRequest(request.follower, "rejected")}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}
      {loading && <div className="status-message">Loading...</div>}
    </main>
  );
};

export default Profile;
