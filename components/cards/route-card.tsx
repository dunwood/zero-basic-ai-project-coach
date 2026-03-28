type RouteCardProps = {
  name: string;
  summary: string;
  fitFor: string;
  requirement: string;
  difficulty: string;
  tag: string;
};

export function RouteCard({
  name,
  summary,
  fitFor,
  requirement,
  difficulty,
  tag,
}: RouteCardProps) {
  return (
    <article className="surface-panel flex h-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
            {tag}
          </span>
          <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {difficulty}
        </span>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{summary}</p>

      <dl className="grid gap-4 text-sm">
        <div>
          <dt className="font-medium text-slate-900">适合谁</dt>
          <dd className="mt-1 leading-6 text-muted-foreground">{fitFor}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-900">使用条件</dt>
          <dd className="mt-1 leading-6 text-muted-foreground">{requirement}</dd>
        </div>
      </dl>

      <button
        type="button"
        className="mt-auto rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        选择这条路线
      </button>
    </article>
  );
}
