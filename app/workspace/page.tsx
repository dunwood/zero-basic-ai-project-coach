import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";

export default function WorkspacePage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="项目工作区"
          title="先从一个具体项目进入工作区"
          description="工作区会承接你创建好的项目，并作为后续 AI 澄清流程的入口。"
        />

        <div className="surface-panel max-w-3xl space-y-5 p-8">
          <p className="text-base leading-7 text-muted-foreground">
            当前这里先保留为入口页。你可以先创建一个项目，系统会自动跳转到对应的工作区详情页。
          </p>
          <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5">
            <p className="text-sm text-slate-900">下一步建议</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              从项目想法输入页开始，先把你的目标和想法写下来，再进入对应的工作区。
            </p>
          </div>
          <Link
            href="/project/new"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            去创建一个项目
          </Link>
        </div>
      </div>
    </section>
  );
}
