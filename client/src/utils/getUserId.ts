import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types";

export function getUserId(): string | null {
  const authData = localStorage.getItem("auth");

  if (!authData) return null;

  try {
    const auth = JSON.parse(authData);
    const accessToken = auth.accessToken;

    if (!accessToken) return null;

    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.AccountId ?? null;
  } catch (error) {
    console.error("Failed to decode access token", error);
    return null;
  }
}