import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Footer() {
  const [vote, setVote] = useState<boolean | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(useful: boolean) {
    setVote(useful);
    setBusy(true);
    const { error } = await supabase.from("feedback").insert({ is_useful: useful, suggestion: suggestion.trim() || null });
    setBusy(false);
    if (error) {
      toast.error("Couldn't send feedback. Try again.");
      return;
    }
    setSubmitted(true);
    toast.success("Thanks for the feedback!");
  }

  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                LevelUp <span className="brand-gradient-text">DZ</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              A directory of courses, competitions and volunteering built for Algerian
              students who dream of joining the world's best universities.
            </p>
            <p className="mt-8 text-xs text-muted-foreground">
              © {new Date().getFullYear()} LevelUp DZ — Built with care for طلاب الجزائر.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 soft-shadow animate-fade-up">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold">You're the best ✨</h3>
                <p className="mt-1 text-sm text-muted-foreground">Your feedback helps us improve.</p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold">Did you find this useful?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us in one line what we should add next.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => submit(true)}
                    disabled={busy}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium transition-all hover:scale-[1.02] hover:border-primary",
                      vote === true && "border-primary bg-accent text-accent-foreground",
                    )}
                  >
                    <ThumbsUp className="h-4 w-4" /> Yes
                  </button>
                  <button
                    onClick={() => submit(false)}
                    disabled={busy}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium transition-all hover:scale-[1.02] hover:border-destructive",
                      vote === false && "border-destructive bg-destructive/10",
                    )}
                  >
                    <ThumbsDown className="h-4 w-4" /> Not yet
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <Textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Optional: a quick suggestion…"
                    className="min-h-[44px] resize-none"
                    maxLength={500}
                  />
                  <Button
                    onClick={() => submit(vote ?? true)}
                    disabled={busy || (!suggestion.trim() && vote === null)}
                    className="h-auto self-stretch"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}