// Fixed issues with token usage and unused variable 'err'
import { useState, useEffect } from "react";
import { getProfile } from "../services/accounts.services";
import { type ProfileData } from "../types/accounts.types";
export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found in localStorage.");
        }
        const data = await getProfile(token); // Pass token to the API function
        setProfile(data);
      } catch {
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
