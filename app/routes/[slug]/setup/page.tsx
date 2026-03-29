import Link from "next/link";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
import { routeCatalog } from "@/lib/data/routes";

type RouteSetupPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const quickStartExercises = [
  "在终端或工具里完成第一次登录 / 授权。",
  "创建一个空白测试目录，确认工具能正常读取目录。",
  "执行一次最小命令练习，例如生成 hello world 页面或解释一段示例代码。",
];

export default async function RouteSetupPage({ params }: RouteSetupPageProps) {
  const { slug } = await params;
  const route = routeCatalog.find((item) => item.id === slug);

  if (!route) {
    return (
      <section className="section-space">
        <div className="container-shell space-y-8">
          <PageBackLinks
            items={[
              { label: "返回首页", href: "/" },
              { label: "返回路线页", href: "/routes" },
              { label: "返回上一步", type: "back", fallbackHref: "/routes" },
            ]}
          />

          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="安装与起步练习"
              title="没有找到这条路线"
              description="这条路线可能不存在，或当前还没有准备好对应的安装说明。"
            />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/routes"
                className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                返回路线页重新选择
              </Link>
              <Link
                href="/project/new"
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                跳过安装，直接创建项目
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回路线页", href: "/routes" },
            { label: "返回上一步", type: "back", fallbackHref: "/routes" },
          ]}
        />

        <SectionHeader
          eyebrow="安装与起步练习"
          title={`先把 ${route.name} 装好，再进入项目流`}
          description="这一步先帮助你把工具装起来，并做一次最小练习。完成后再进入项目创建，能减少后面在工作区里卡住的概率。"
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
          <article className="space-y-5">
            <div className="surface-panel space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                  {route.recommendationTag}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  安装难度：{route.installDifficulty}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">{route.name}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{route.shortDescription}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs text-muted-foreground">推荐模型</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{route.modelName}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs text-muted-foreground">推荐工具</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{route.toolName}</p>
                </div>
              </div>
            </div>

            <div className="surface-panel space-y-4 p-6">
              <h2 className="text-lg font-semibold text-slate-900">推荐工具清单</h2>
              <ul className="space-y-3 text-sm leading-7 text-slate-700">
                <li>- 模型账号：{route.modelName}</li>
                <li>- 主工具：{route.toolName}</li>
                <li>- 基础环境：浏览器、终端或 IDE（按该路线要求准备）</li>
              </ul>
            </div>

            <div className="surface-panel space-y-4 p-6">
              <h2 className="text-lg font-semibold text-slate-900">安装顺序</h2>
              <div className="space-y-4">
                {route.steps.map((step) => (
                  <div key={step.id} className="rounded-2xl border border-border bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      步骤 {step.stepOrder}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel space-y-4 p-6">
              <h2 className="text-lg font-semibold text-slate-900">最小命令练习</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                当前先用静态版起步练习占位。你不需要做完整项目，只要确认这条路线已经能正常工作。
              </p>
              <ul className="space-y-3 text-sm leading-7 text-slate-700">
                {quickStartExercises.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="surface-panel space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">完成这一步后</p>
              <h2 className="text-xl font-semibold text-slate-900">再进入项目创建</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                路线安装流和项目执行流在这里分开。先把工具环境跑通，再去创建项目会更顺。
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
              如果你已经装好了工具，也可以直接跳过这一步，但建议至少做一次最小练习。
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/project/new?route=${route.id}`}
                className="inline-flex justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                完成安装，去创建项目
              </Link>
              <Link
                href="/project/new"
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                我已准备好，跳过安装
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
