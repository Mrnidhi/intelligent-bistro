import Constants from "expo-constants";
import { CartItem } from "../types/cart";
import { ChatResponse } from "../types/chat";
import { MenuItem } from "../types/menu";

// When running in Expo Go on a physical device, `debuggerHost` gives us the
// Mac's LAN IP (e.g. 192.168.1.42:8081). We swap the Expo port for 4000.
function getBaseUrl(): string {
  const host = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
  if (host) {
    const ip = host.split(":")[0];
    return `http://${ip}:4000`;
  }
  return "http://localhost:4000";
}

const BASE_URL = getBaseUrl();

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${BASE_URL}/menu`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  const data = await res.json();
  return data.menu as MenuItem[];
}

export async function sendChatMessage(
  message: string,
  currentCart: CartItem[]
): Promise<ChatResponse> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, currentCart }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "Chat request failed");
  }
  return res.json() as Promise<ChatResponse>;
}
