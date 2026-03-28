type StatusCardProps = {
  title: string;
  description: string;
  actionText: string;
};

export function StatusCard({ title, description, actionText }: StatusCardProps) {
  return (
    <article className="surface-panel flex h-full flex-col gap-4 p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
        {title.slice(0, 2)}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <p className="mt-auto text-sm font-medium text-blue-700">{actionText}</p>
    </article>
  );
}
