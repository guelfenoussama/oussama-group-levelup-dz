import { useState } from "react";
import { Send, Lightbulb } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function IdeasBox() {
  const { t } = useI18n();
  const [suggestion, setSuggestion] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const text = suggestion.trim();
    if (!text) {
      toast.error(t("ideas.empty"));
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("feedback").insert({ is_useful: true, suggestion: text });
    setBusy(false);
    if (error) {
      toast.error(t("ideas.toast.err"));
      return;
    }
    toast.success(t("ideas.toast.ok"));
    setSuggestion("");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 soft-shadow animate-fade-up">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold">{t("ideas.title")}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t("ideas.subtitle")}</p>
      <Textarea
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        placeholder={t("ideas.placeholder")}
        className="mt-3 min-h-[88px] resize-none"
        maxLength={2000}
      />
      <div className="mt-3 flex justify-end">
        <Button onClick={submit} disabled={busy || !suggestion.trim()} className="gap-2">
          <Send className="h-4 w-4" /> {t("ideas.submit")}
        </Button>
      </div>
    </div>
  );
}