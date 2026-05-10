import { useState } from "react";
import {
  getFollowRequests,
  getProfile,
  getUserProfile,
  followUser,
  unfollowUser,
  respondFollowRequest,
} from "../services/user.api";

export const useUser = () => {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [lookup, setLookup] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      setProfile(response);
    } catch (error) {
      console.error("Unable to load profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await getFollowRequests();
      setRequests(response.pendingRequests || []);
    } catch (error) {
      console.error("Unable to load follow requests:", error);
      setRequests([]);
    }
  };

  const lookupUser = async (username) => {
    if (!username) return;
    setStatusMessage(null);
    setLoading(true);
    try {
      const response = await getUserProfile(username);
      setLookup(response);
    } catch (error) {
      console.error("Lookup failed:", error);
      setLookup(null);
      setStatusMessage("User not found or unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  const requestFollow = async (username) => {
    setLoading(true);
    try {
      const response = await followUser(username);
      setStatusMessage(response.message);
      await loadRequests();
      await loadProfile();
    } catch (error) {
      console.error("Follow request failed:", error);
      setStatusMessage(error?.response?.data?.message || "Unable to follow user.");
    } finally {
      setLoading(false);
    }
  };

  const requestUnfollow = async (username) => {
    setLoading(true);
    try {
      const response = await unfollowUser(username);
      setStatusMessage(response.message);
      await loadRequests();
      await loadProfile();
    } catch (error) {
      console.error("Unfollow failed:", error);
      setStatusMessage(error?.response?.data?.message || "Unable to unfollow user.");
    } finally {
      setLoading(false);
    }
  };

  const respondRequest = async (username, action) => {
    setLoading(true);
    try {
      const response = await respondFollowRequest(username, action);
      setStatusMessage(response.message);
      await loadRequests();
      await loadProfile();
    } catch (error) {
      console.error("Responding to request failed:", error);
      setStatusMessage(error?.response?.data?.message || "Unable to update request.");
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    requests,
    lookup,
    statusMessage,
    loading,
    setStatusMessage,
    loadProfile,
    loadRequests,
    lookupUser,
    requestFollow,
    requestUnfollow,
    respondRequest,
  };
};
