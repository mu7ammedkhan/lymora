import type { SupabaseClientOptions } from "@supabase/supabase-js";
import WebSocket from "ws";

type RealtimeTransport = NonNullable<SupabaseClientOptions<"public">["realtime"]>["transport"];

export const nodeWebSocketTransport = WebSocket as unknown as RealtimeTransport;
