import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

const FIRST_VISIT_KEY = "levelup_first_visit_at";
const DISMISSED_KEY = "levelup_signup_prompt_dismissed";
const DELAY_MS = 5 * 60 * 1000; // 5 minutes

export function SignupPrompt() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  // Track auth state — never show to signed-in users
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user);
      if (session?.user) setOpen(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (signedIn === null || signedIn) return;
    if (localStorage.getItem(DISMISSED_KEY) === "1") return;

    let firstVisit = Number(localStorage.getItem(FIRST_VISIT_KEY) || 0);
    if (!firstVisit) {
      firstVisit = Date.now();
      localStorage.setItem(FIRST_VISIT_KEY, String(firstVisit));
    }

    const elapsed = Date.now() - firstVisit;
    const remaining = Math.max(0, DELAY_MS - elapsed);

    const timer = window.setTimeout(() => {
      if (localStorage.getItem(DISMISSED_KEY) === "1") return;
      setOpen(true);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [signedIn]);

  function dismiss(persist: boolean) {
    if (persist && typeof window !== "undefined") {
      localStorage.setItem(DISMISSED_KEY, "1");
    }
    setOpen(false);
  }

  if (signedIn) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(false); }}>
      <DialogContent className="sm:max-w-md overflow-hidden border-border/60 p-0">
        <div
          aria-hidden
          className="h-24 w-full bg-[var(--brand-gradient,linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary)/0.6)))] relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background/90 backdrop-blur soft-shadow">
              <Flame className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle className="text-xl tracking-tight">
              {t("signup.prompt.title")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {t("signup.prompt.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 rounded-xl border border-border bg-accent/40 p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{t("signup.prompt.perk")}</span>
          </div>

          <DialogFooter className="mt-6 flex-col gap-2 sm:flex-col">
            <Button asChild className="w-full" onClick={() => dismiss(true)}>
              <Link to="/auth">{t("signup.prompt.cta")}</Link>
            </Button>
            <button
              type="button"
              onClick={() => dismiss(true)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("signup.prompt.later")}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}