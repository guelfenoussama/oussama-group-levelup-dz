import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ShareButtons } from "@/components/site/ShareButtons";
import { IdeasBox } from "@/components/site/IdeasBox";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-8 md:grid-cols-2">
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
              {t("footer.tagline")}
            </p>
            <div className="mt-6 max-w-md">
              <ShareButtons variant="panel" url="https://oussama-group-levelup-dz.lovable.app" />
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              © {new Date().getFullYear()} LevelUp DZ — {t("footer.copyright")}
            </p>
          </div>

          <IdeasBox />
        </div>
      </div>

      <div className="border-t border-border/50 py-6 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
          Brought to you by Oussama Group
        </p>
      </div>
    </footer>
  );
}