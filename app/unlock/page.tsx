import Link from "next/link";
import { UnlockForm } from "@/components/access/unlock-form";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";

export default function UnlockPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回上一步", type: "back", fallbackHref: "/" },
          ]}
        />

        <SectionHeader
          eyebrow="访问解锁"
          title="先输入访问码，再继续使用"
          description="这里只做本地激活校验。输入正确访问码后，会把激活状态保存在当前浏览器里。"
        />

        <UnlockForm />

        <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">验证完成后继续</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              解锁成功后，你可以返回首页，或直接进入路线和项目流程继续。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/routes"
              className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              去看路线
            </Link>
            <Link
              href="/project/new"
              className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              去创建项目
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
