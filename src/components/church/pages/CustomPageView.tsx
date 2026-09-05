"use client";

/**
 * CustomPageView — renders a page created in the admin page builder.
 * Finds a published page by slug; shows a friendly not-found state otherwise.
 */

import { FileQuestion } from "lucide-react";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import { EmptyState, MarkdownContent, PageHeader } from "../shared";

export default function CustomPageView({ slug }: { slug: string }) {
  const t = useT();
  const loc = useLoc();
  const formatDate = useDateFormatter();
  const customPages = useChurchStore((s) => s.data.customPages);

  const page = customPages.find((p) => p.slug === slug && p.published);

  if (!page) {
    return (
      <div>
        <PageHeader
          title={loc({ ru: "Страница не найдена", tj: "Сахифа ёфт нашуд" })}
          icon={<FileQuestion className="h-7 w-7" aria-hidden="true" />}
        />
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <EmptyState
            icon={<FileQuestion className="h-7 w-7" aria-hidden="true" />}
            title={loc({ ru: "Здесь пока ничего нет", tj: "Дар ин ҷо ҳанӯз чизе нест" })}
            description={loc({
              ru: "Возможно, страница ещё не создана или была скрыта. Загляните на главную — там всегда самое важное.",
              tj: "",
            })}
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={loc(page.title)} />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-label={loc(page.title)}>
        <div className="mx-auto max-w-3xl rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card sm:p-10">
          <MarkdownContent content={loc(page.content)} />
        </div>
        <p className="mt-6 text-center text-xs font-medium text-stone-500">
          {t("page.lastUpdated")}: {formatDate(page.createdAt)}
        </p>
      </section>
    </div>
  );
}
