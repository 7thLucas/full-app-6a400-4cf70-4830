import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { CATEGORY_META, type Category } from "../types";

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl bg-card text-card-foreground border border-border/70 shadow-[0_2px_12px_-6px_rgba(46,42,38,0.18)]",
        onClick && "cursor-pointer active:scale-[0.99] transition-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Category accent dot + pill ────────────────────────────────────────────────
export function CategoryDot({ category }: { category: Category }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
      style={{ backgroundColor: CATEGORY_META[category].chartVar }}
      aria-hidden
    />
  );
}

export function CategoryPill({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, ${meta.chartVar} 14%, transparent)`,
        color: meta.chartVar,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.chartVar }}
      />
      {meta.label}
    </span>
  );
}

// ── Status chip ───────────────────────────────────────────────────────────────
type ChipTone = "neutral" | "positive" | "warning" | "alert" | "primary";

const CHIP_TONES: Record<ChipTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  positive: "bg-primary/12 text-primary",
  warning: "bg-accent/25 text-accent-foreground",
  alert: "bg-destructive/15 text-destructive",
  primary: "bg-primary text-primary-foreground",
};

export function StatusChip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        CHIP_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

// ── Page scaffold ─────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-5 pt-6 pb-3">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  message,
}: {
  icon?: ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        {message}
      </p>
    </div>
  );
}
