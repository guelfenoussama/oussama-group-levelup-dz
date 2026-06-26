import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const FEEDBACK_STORAGE_KEY = "hasInteractedWithFeedback";
const LEGACY_FEEDBACK_STORAGE_KEY = "levelup_feedback_interacted";
const DELAY_MS = 20 * 1000;

export function FeedbackModal() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      localStorage.getItem(FEEDBACK_STORAGE_KEY) === "true" ||
      localStorage.getItem(LEGACY_FEEDBACK_STORAGE_KEY) === "true"
    ) {
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function markDone() {
    if (typeof window !== "undefined") {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, "true");
    }
    setOpen(false);
  }

  async function submit(useful: boolean) {
    setBusy(true);
    markDone();
    const { error } = await supabase.from("feedback").insert({ is_useful: useful, suggestion: null });
    setBusy(false);
    if (error) {
      toast.error(t("fb.toast.err"));
      return;
    }
    toast.success(t("fb.toast.ok"));
  }

  function handleOpenChange(next: boolean) {
    if (!next) markDone();
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("fb.q")}</DialogTitle>
          <DialogDescription>{t("fb.hint")}</DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => submit(true)}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium transition-all hover:scale-[1.02] hover:border-primary disabled:opacity-60"
          >
            <ThumbsUp className="h-4 w-4" /> {t("fb.yes")}
          </button>
          <button
            onClick={() => submit(false)}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium transition-all hover:scale-[1.02] hover:border-destructive disabled:opacity-60"
          >
            <ThumbsDown className="h-4 w-4" /> {t("fb.no")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}