import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      throw new Response("Forbidden", { status: 403 });
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [usersRes, visitsRes] = await Promise.all([
      supabaseAdmin.rpc("get_total_users"),
      supabaseAdmin.rpc("get_total_visitors"),
    ]);
    return {
      users: Number(usersRes.data ?? 0),
      visitors: Number(visitsRes.data ?? 0),
    };
  });