import Link from "next/link";
import type { ActionLinkItem } from "@/lib/data/action-links";

type GuidedActionItem = ActionLinkItem & {
  title: string;
  description: string;
};

type GuidedActionPanelProps = {
  title: string;
  description: string;
  items: GuidedActionItem[];
};

function ActionButton({ item }: { item: GuidedActionItem }) {
  const className =
    "inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400";

  if (item.disabled || !item.href) {
    return (
      <button type="button" disabled className={className}>
        {item.label}
      </button>
    );
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

export function GuidedActionPanel({ title, description, items }: GuidedActionPanelProps) {
  return (
    <section className="surface-panel space-y-5 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={`${item.title}-${item.label}`} className="rounded-3xl border border-border bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
            <div className="mt-4">
              <ActionButton item={item} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {item.helperText ?? "完成后返回这里继续。"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
