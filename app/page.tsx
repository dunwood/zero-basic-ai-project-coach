import { cookies } from "next/headers";
import { UnlockForm } from "@/components/access/unlock-form";
import { HomePageContent } from "@/components/home/home-page-content";
import {
  ACCESS_ACTIVATION_COOKIE_KEY,
  isValidAccessCode,
  normalizeAccessCode,
} from "@/lib/access-codes";

type HomePageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function isActivated(cookieValue: string | undefined) {
  if (!cookieValue) {
    return false;
  }

  return isValidAccessCode(normalizeAccessCode(cookieValue));
}

function HomeLockedState({ nextPath }: { nextPath?: string }) {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <section className="surface-panel overflow-hidden p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                零基础用户做项目的 AI 指导书 + 操作台
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  先输入访问码，再进入完整首页
                </h1>
                <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                  这个网站会先验证访问码。验证通过后，你就能继续看路线、创建项目、进入工作区，并且刷新后仍保持已激活状态。
                </p>
              </div>

              <div className="rounded-3xl border border-dashed border-border bg-white/80 px-5 py-4">
                <p className="text-sm leading-7 text-slate-700">
                  如果你是第一次进入，请先输入访问码；如果你已经激活过，这台设备下次再打开首页通常会直接进入正常内容。
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                "先输入访问码，完成本机激活。",
                "激活后可继续查看路线、安装说明和项目流程。",
                "项目与最近记录会保存在本地，不依赖数据库才能运行。",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <UnlockForm nextPath={nextPath} submitLabel="验证并进入" />
      </div>
    </section>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(ACCESS_ACTIVATION_COOKIE_KEY)?.value;

  if (isActivated(accessCookie)) {
    return <HomePageContent />;
  }

  return <HomeLockedState nextPath={params.next} />;
}
