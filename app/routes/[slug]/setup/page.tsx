import Link from "next/link";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
import { SetupCommandPanel } from "@/components/ui/setup-command-panel";
import { routeCatalog } from "@/lib/data/routes";

type RouteSetupPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SetupStep = {
  id: string;
  title: string;
  whatToDo: string;
  whereToGo: string;
  successCheck: string;
};

type ToolGuide = {
  fitFor: string;
  preparation: string;
  toolAction: string;
  toolWhere: string;
  toolSuccess: string;
};

type SetupResourceLink = {
  label: string;
  href: string;
};

const baseSteps: Omit<SetupStep, "id">[] = [
  {
    title: "步骤 1：安装 VS Code",
    whatToDo: "下载并安装 VS Code，按默认选项完成即可。安装后先打开一次，确认能正常进入编辑器。",
    whereToGo: "访问 VS Code 官网，点击下载适合你系统的版本。",
    successCheck: "你能在桌面或开始菜单里找到 VS Code，并且点击后可以正常打开。",
  },
  {
    title: "步骤 2：安装 Node.js",
    whatToDo: "进入 Node.js 官网，下载并安装 LTS 版本。安装完成后，重新打开终端准备验证命令。",
    whereToGo: "访问 Node.js 官网，选择 LTS 版本下载安装。",
    successCheck: "在终端输入 `node -v` 后，能看到类似 `v22.0.0` 的版本号。",
  },
  {
    title: "步骤 3：安装 Git",
    whatToDo: "进入 Git 官网下载安装包，安装过程保持默认设置即可。装完后重新打开终端。",
    whereToGo: "访问 Git 官网，下载适合你系统的安装包。",
    successCheck: "在终端输入 `git --version` 后，能看到类似 `git version 2.49.0` 的版本号。",
  },
];

const toolSetupGuide: Record<string, ToolGuide> = {
  "deepseek-opencode": {
    fitFor: "适合想先用中文环境起步，再慢慢熟悉 AI 编程工具的人。",
    preparation: "本页会先帮你准备 VS Code、Node.js、Git，再继续到 DeepSeek + OpenCode 的安装方向。",
    toolAction: "安装并打开 OpenCode，按界面提示完成 DeepSeek 相关登录或授权，然后进入一个空白文件夹尝试发出第一条指令。",
    toolWhere: "先确认你的 DeepSeek 账号可用，再按 OpenCode 官方说明完成安装与登录。",
    toolSuccess: "你能打开 OpenCode，并看到可继续下一步的登录或聊天入口。",
  },
  "qwen-lingma": {
    fitFor: "适合更偏向中文界面、想先从图形化体验开始的新手。",
    preparation: "本页会先帮你装好基础开发环境，再继续到通义灵码的安装方向。",
    toolAction: "在 VS Code 扩展市场里搜索并安装通义灵码，安装后按提示完成登录。",
    toolWhere: "打开 VS Code 扩展市场，搜索“通义灵码”，再按照插件页说明操作。",
    toolSuccess: "你能在 VS Code 里看到通义灵码入口，并能正常打开。",
  },
  "doubao-trae": {
    fitFor: "适合想先尝试国内路线，同时愿意对比不同 AI 工具体验的人。",
    preparation: "本页会先帮你装好基础环境，再继续到 TRAE 的安装方向。",
    toolAction: "下载并安装 TRAE，按界面提示完成登录或授权，然后准备开始最小练习。",
    toolWhere: "先确认你要使用的账号可用，再按 TRAE 官方说明完成安装。",
    toolSuccess: "你能正常打开 TRAE，并看到工具主界面。",
  },
  "qianfan-wenxin-kuaima": {
    fitFor: "适合已经习惯国内云平台生态，希望沿着熟悉平台继续往下走的人。",
    preparation: "本页会先帮你装好基础环境，再继续到文心快码的安装方向。",
    toolAction: "在开发工具里安装文心快码，打开后按提示完成百度相关账号登录或授权。",
    toolWhere: "优先在 VS Code 扩展市场搜索“文心快码”，再按插件页说明操作。",
    toolSuccess: "你能看到文心快码入口，并确认已经完成登录。",
  },
  "chatgpt-codex-cli": {
    fitFor: "适合愿意接触终端、希望更早熟悉命令行协作方式的用户。",
    preparation: "本页会先帮你准备 VS Code、Node.js、Git，再继续到 ChatGPT + Codex CLI 的安装方向。",
    toolAction: "按 Codex 文档完成安装与登录，再进入一个空白目录做第一条最小命令练习。",
    toolWhere: "先确认你能正常访问 ChatGPT，再按 Codex 文档完成安装和登录。",
    toolSuccess: "终端能识别 Codex 相关命令，你也已经完成登录。",
  },
  "claude-claude-code": {
    fitFor: "适合希望 AI 更像搭档，并愿意接受终端工作流的用户。",
    preparation: "本页会先帮你装好基础环境，再继续到 Claude Code 的安装方向。",
    toolAction: "按 Claude Code 文档完成安装与登录，然后进入测试目录尝试最小练习。",
    toolWhere: "先确认 Claude 账号可用，再按 Claude Code 官方说明操作。",
    toolSuccess: "终端能识别 Claude Code 命令，并且工具可以正常打开。",
  },
  "gemini-gemini-cli": {
    fitFor: "适合想尝试另一条国际路线，并愿意做基础命令行配置的人。",
    preparation: "本页会先帮你装好基础环境，再继续到 Gemini CLI 的安装方向。",
    toolAction: "按 Gemini CLI 官方说明完成安装和登录，再进入一个测试目录开始最小练习。",
    toolWhere: "先确认 Gemini 账号可用，再按 Gemini CLI 官方说明操作。",
    toolSuccess: "终端可以识别 Gemini CLI 命令，并且你已经完成登录。",
  },
};

const staticResourceLinks: Record<string, SetupResourceLink> = {
  "base-step-1": {
    label: "打开 VS Code 官网",
    href: "https://code.visualstudio.com/",
  },
  "base-step-2": {
    label: "打开 Node.js 官网",
    href: "https://nodejs.org/",
  },
  "base-step-3": {
    label: "打开 Git 官网",
    href: "https://git-scm.com/downloads",
  },
};

const aiToolResourceLinks: Partial<Record<string, SetupResourceLink>> = {
  "chatgpt-codex-cli": {
    label: "打开 Codex 文档",
    href: "https://platform.openai.com/docs/codex",
  },
  "claude-claude-code": {
    label: "打开 Claude Code 官网",
    href: "https://docs.anthropic.com/en/docs/claude-code/overview",
  },
  "gemini-gemini-cli": {
    label: "打开 Gemini CLI 官网",
    href: "https://github.com/google-gemini/gemini-cli",
  },
};

function getSetupSteps(slug: string, toolName: string): SetupStep[] {
  const guide = toolSetupGuide[slug];

  return [
    ...baseSteps.map((step, index) => ({
      id: `base-step-${index + 1}`,
      ...step,
    })),
    {
      id: "tool-step",
      title: `步骤 4：安装并登录 ${toolName}`,
      whatToDo: guide.toolAction,
      whereToGo: guide.toolWhere,
      successCheck: guide.toolSuccess,
    },
  ];
}

function getResourceLink(stepId: string, slug: string): SetupResourceLink {
  if (stepId === "tool-step") {
    return aiToolResourceLinks[slug] ?? {
      label: "查看推荐工具",
      href: "/routes",
    };
  }

  return staticResourceLinks[stepId];
}

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
              { label: "返回路线选择", href: "/routes" },
              { label: "返回上一页", type: "back", fallbackHref: "/routes" },
            ]}
          />

          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="安装教程"
              title="没有找到这条路线"
              description="这条路线可能不存在，或者当前还没有对应的安装说明。"
            />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/routes"
                className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                返回路线选择
              </Link>
              <Link
                href="/project/new"
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                先去创建项目
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const guide = toolSetupGuide[route.id];
  const setupSteps = getSetupSteps(route.id, route.toolName);
  const practiceCommands = [
    {
      label: "检查 Node.js 是否安装成功",
      command: "node -v",
    },
    {
      label: "检查 Git 是否安装成功",
      command: "git --version",
    },
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回路线选择", href: "/routes" },
            { label: "返回上一页", type: "back", fallbackHref: "/routes" },
          ]}
        />

        <SectionHeader
          eyebrow="安装教程"
          title={`先把 ${route.name} 装好，再开始创建项目`}
          description="这是一个静态但可执行的安装清单。你只需要按顺序打开官网、完成安装，再运行最小命令检查环境。"
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
          <article className="space-y-6">
            <div className="surface-panel space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                  {route.recommendationTag}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  安装难度：{route.installDifficulty}
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">A. 当前路线说明</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-xs text-muted-foreground">你选的是哪条路线</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{route.name}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-xs text-muted-foreground">这条路线适合谁</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{guide.fitFor}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-xs text-muted-foreground">这页会帮你完成什么</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{guide.preparation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-panel space-y-5 p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">B. 安装步骤</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  建议按顺序完成。每一步都保留了“去哪做”和“看到什么算成功”，并补上了直达链接。
                </p>
              </div>

              <div className="grid gap-4">
                {setupSteps.map((step) => {
                  const resourceLink = getResourceLink(step.id, route.id);

                  return (
                    <section key={step.id} className="rounded-3xl border border-border bg-white p-5">
                      <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                      <dl className="mt-4 space-y-4 text-sm">
                        <div>
                          <dt className="font-medium text-slate-900">要做什么</dt>
                          <dd className="mt-1 leading-6 text-slate-700">{step.whatToDo}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-900">去哪里做</dt>
                          <dd className="mt-1 leading-6 text-slate-700">{step.whereToGo}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-900">做完后如何确认成功</dt>
                          <dd className="mt-1 leading-6 text-slate-700">{step.successCheck}</dd>
                        </div>
                      </dl>

                      <a
                        href={resourceLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        {resourceLink.label}
                      </a>
                    </section>
                  );
                })}
              </div>
            </div>

            <div className="surface-panel space-y-5 p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">C. 最小命令练习</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  安装完成后，把下面两条命令分别运行一遍。只要都能返回版本号，就说明你的基础环境已经准备好了。
                </p>
              </div>

              <SetupCommandPanel commands={practiceCommands} />

              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900">
                如果 `node -v` 和 `git --version` 都返回了版本号，就说明你已经完成了最基本的安装，可以继续下一步。
              </div>
            </div>
          </article>

          <aside className="surface-panel space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">D. 下一步</p>
              <h2 className="text-xl font-semibold text-slate-900">完成安装后，继续创建项目</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                如果你已经完成上面的步骤，并且命令练习能返回版本号，就可以进入项目创建页了。
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm leading-6 text-muted-foreground">
              还没完成也没关系。你可以先回到路线选择重新挑选路线，或者留在当前页继续按步骤安装。
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/project/new?route=${route.id}`}
                className="inline-flex justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                我已完成安装，开始创建项目
              </Link>
              <Link
                href="/routes"
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回路线选择
              </Link>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              小提醒：这个页面只是一步一步带你完成安装，不会自动检测你的电脑，也不会代替你打开本地终端。
            </div>
          </aside>
        </div>

        <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">准备好了就继续</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              底部保留了返回路线选择和进入项目创建页两个入口，方便你继续下一步。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/routes"
              className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              返回路线选择
            </Link>
            <Link
              href={`/project/new?route=${route.id}`}
              className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              完成安装，去创建项目
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
