import Link from "next/link";

type WorkspaceEmptyStateAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type WorkspaceEmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  actions: WorkspaceEmptyStateAction[];
};

export function WorkspaceEmptyState({
  eyebrow,
  title,
  description,
  note,
  actions,
}: WorkspaceEmptyStateProps) {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="surface-panel max-w-3xl space-y-5 p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          </div>

          {note ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5 text-sm leading-6 text-muted-foreground">
              {note}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={`${action.href}-${action.label}`}
                href={action.href}
                className={
                  action.variant === "secondary"
                    ? "inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    : "inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
