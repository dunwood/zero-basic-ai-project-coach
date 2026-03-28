import Link from "next/link";

type WorkspaceQuickLink = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type WorkspaceQuickLinksProps = {
  title?: string;
  description: string;
  links: WorkspaceQuickLink[];
};

export function WorkspaceQuickLinks({
  title = "快捷入口",
  description,
  links,
}: WorkspaceQuickLinksProps) {
  return (
    <div className="surface-panel space-y-4 p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className={
              link.variant === "primary"
                ? "inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                : "inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
