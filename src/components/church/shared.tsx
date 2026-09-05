"use client";

/**
 * Shared presentational components used across the public site.
 * Design language: cream background, teal-700 primary, amber accent,
 * serif (Lora) headings, rounded-3xl cards, soft shadows, thin-line icons.
 */

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small uppercase overline + serif heading + optional amber underline. */
export function SectionHeading({
  overline,
  title,
  description,
  align = "center",
  className,
}: {
  overline?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {overline ? (
        <p
          className={cn(
            "mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-600",
            align === "center" && "justify-center",
          )}
        >
          <span className="inline-block h-px w-6 bg-amber-400" aria-hidden="true" />
          {overline}
          <span className="inline-block h-px w-6 bg-amber-400" aria-hidden="true" />
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-stone-600">{description}</p>
      ) : null}
    </div>
  );
}

/** Big page-level header used at the top of inner pages. */
export function PageHeader({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 px-5 pb-14 pt-12 text-center sm:pb-16 sm:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-amber-300/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-teal-300/25 blur-2xl"
      />
      <div className="relative mx-auto max-w-2xl">
        {icon ? (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-soft backdrop-blur">
            {icon}
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-base leading-relaxed text-teal-50/95 sm:text-lg">{subtitle}</p>
        ) : null}
        {children}
      </div>
    </header>
  );
}

/** Warm verse quotation card. Texts must include accurate Bible references. */
export function VerseCard({
  text,
  reference,
  className,
}: {
  text: string;
  reference: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-6 shadow-soft sm:p-8",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 left-5 select-none font-serif text-7xl leading-none text-amber-300/80"
      >
        &laquo;
      </span>
      <blockquote className="relative pt-4 font-serif text-lg italic leading-relaxed text-stone-700 sm:text-xl">
        {text}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {reference}
      </figcaption>
    </figure>
  );
}

const BADGE_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  in_prayer: "bg-teal-100 text-teal-800 border-teal-200",
  prayed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-stone-100 text-stone-600 border-stone-200",
};

/** Status pill for prayer requests (pastel, warm). */
export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold",
        BADGE_STYLES[status] ?? BADGE_STYLES.archived,
      )}
    >
      {label}
    </span>
  );
}

/** Friendly empty state. */
export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-teal-200 bg-white/70 p-10 text-center shadow-card">
      {icon ? (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          {icon}
        </div>
      ) : null}
      <p className="font-serif text-lg font-semibold text-teal-900">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

/** Decorative wave divider (soft teal) between sections. */
export function WaveDivider({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full leading-none", flip && "rotate-180", className)}
    >
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="h-[40px] w-full sm:h-[60px]">
        <path
          d="M0,32 C240,60 480,4 720,24 C960,44 1200,10 1440,32 L1440,60 L0,60 Z"
          fill="rgb(13 148 136 / 0.10)"
        />
        <path
          d="M0,44 C260,20 520,54 760,38 C1000,22 1240,52 1440,36 L1440,60 L0,60 Z"
          fill="rgb(245 158 11 / 0.10)"
        />
      </svg>
    </div>
  );
}

/**
 * Very small renderer for page-builder content:
 * "## " headings, "- " lists, blank line = new paragraph.
 */
export function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-2 text-xl font-semibold sm:text-2xl">
              {block.slice(3)}
            </h2>
          );
        }
        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-6 text-stone-700 leading-relaxed">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-stone-700">
            {block}
          </p>
        );
      })}
    </div>
  );
}
