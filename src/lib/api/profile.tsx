import { env } from "../../env";

const API_BASE_URL = env.API_BASE_URL;

export const fetchProfile = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: "PATCH",
      credentials: "include", 
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data;
  } catch (error) {
    console.error("Fetch profile error:", error);
    throw error;
  }
};
