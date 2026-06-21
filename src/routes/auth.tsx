import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — LevelUp DZ" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      router.invalidate();
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (result.error) toast.error("Google sign-in failed.");
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 soft-shadow animate-fade-up">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold">LevelUp DZ</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Access the admin dashboard." : "New admin? Sign up below."}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full"
          onClick={handleGoogle}
        >
          Continue with Google
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}