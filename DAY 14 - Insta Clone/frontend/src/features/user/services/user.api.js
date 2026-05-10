import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users",
  withCredentials: true,
});

export async function getProfile() {
  const response = await api.get("/profile");
  return response.data;
}

export async function getUserProfile(username) {
  const response = await api.get(`/${username}`);
  return response.data;
}

export async function followUser(username) {
  const response = await api.post(`/follow/${username}`);
  return response.data;
}

export async function unfollowUser(username) {
  const response = await api.post(`/unfollow/${username}`);
  return response.data;
}

export async function getFollowRequests() {
  const response = await api.get("/follow-requests");
  return response.data;
}

export async function respondFollowRequest(username, action) {
  const response = await api.patch(`/follow-request/${username}`, { action });
  return response.data;
}
