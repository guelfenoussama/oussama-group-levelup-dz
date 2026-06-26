import { Linkedin, Facebook, Twitter, MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Props = {
  url?: string;
  title?: string;
  variant?: "inline" | "panel";
  label?: string;
  className?: string;
};

export function ShareButtons({ url, title, variant = "inline", label, className }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "https://oussama-group-levelup-dz.lovable.app");
  const shareTitle = title ?? "LevelUp DZ — Real skills for Algerian students";

  const u = encodeURIComponent(shareUrl);
  const tx = encodeURIComponent(shareTitle);

  const links: { name: string; href: string; Icon: typeof Linkedin; color: string }[] = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: Linkedin,
      color: "hover:text-[#0a66c2] hover:border-[#0a66c2]",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: Facebook,
      color: "hover:text-[#1877f2] hover:border-[#1877f2]",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${tx}%20${u}`,
      Icon: MessageCircle,
      color: "hover:text-[#25d366] hover:border-[#25d366]",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${tx}`,
      Icon: Twitter,
      color: "hover:text-[#1da1f2] hover:border-[#1da1f2]",
    },
  ];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(t("share.copied"));
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(t("share.copyErr"));
    }
  };

  const buttonsRow = (
    <div className="flex flex-wrap items-center gap-2">
      {links.map(({ name, href, Icon, color }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Share on ${name}`}
          title={`Share on ${name}`}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:scale-105",
            color,
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={onCopy}
        aria-label={t("share.copy")}
        title={t("share.copy")}
        className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:scale-105 hover:border-primary hover:text-primary"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );

  if (variant === "panel") {
    return (
      <div className={cn("rounded-2xl border border-border bg-card p-5 soft-shadow", className)}>
        <h3 className="text-base font-semibold">{label ?? t("share.platform.title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("share.platform.desc")}</p>
        <div className="mt-4">{buttonsRow}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label ?? t("share.short")}
      </span>
      {buttonsRow}
    </div>
  );
}