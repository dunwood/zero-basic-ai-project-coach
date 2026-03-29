"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type PageBackLinkItem = {
  label: string;
  href?: string;
  fallbackHref?: string;
  variant?: "primary" | "secondary";
  type?: "link" | "back";
};

type PageBackLinksProps = {
  items: PageBackLinkItem[];
};

export function PageBackLinks({ items }: PageBackLinksProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) =>
        item.type === "back" ? (
          <button
            key={`${item.label}-${item.fallbackHref ?? "back"}`}
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
                return;
              }

              if (item.fallbackHref) {
                router.push(item.fallbackHref);
              }
            }}
            className={
              item.variant === "primary"
                ? "inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                : "inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            }
          >
            {item.label}
          </button>
        ) : (
          <Link
            key={`${item.label}-${item.href ?? ""}`}
            href={item.href ?? item.fallbackHref ?? "/"}
            className={
              item.variant === "primary"
                ? "inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                : "inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            }
          >
            {item.label}
          </Link>
        ),
      )}
    </div>
  );
}
