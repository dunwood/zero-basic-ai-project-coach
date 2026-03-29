import Link from "next/link";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
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

const baseSteps: Omit<SetupStep, "id">[] = [
  {
    title: "步骤 1：安装 VS Code",
    whatToDo: "打开 VS Code 官网下载安装包，按默认选项安装。安装完成后，请把 VS Code 打开一次。",
    whereToGo: "浏览器访问 https://code.visualstudio.com/ ，点击 Download 下载对应系统版本。",
    successCheck: "桌面或开始菜单里能找到 VS Code，点开后能正常进入编辑器页面，就算成功。",
  },
  {
    title: "步骤 2：安装 Node.js",
    whatToDo: "打开 Node.js 官网，下载安装 LTS 版本。安装完成后重新打开终端，准备验证命令。",
    whereToGo: "浏览器访问 https://nodejs.org/ ，选择 LTS 版本下载并安装。",
    successCheck: "在终端输入 `node -v`，如果看到类似 `v22.0.0` 这样的版本号，就说明安装成功。",
  },
  {
    title: "步骤 3：安装 Git",
    whatToDo: "打开 Git 官网下载安装。安装时保持默认设置即可，装完后重新打开终端。",
    whereToGo: "浏览器访问 https://git-scm.com/downloads ，下载适合你电脑系统的版本。",
    successCheck: "在终端输入 `git --version`，如果看到类似 `git version 2.49.0` 的提示，就说明安装成功。",
  },
];

const toolSetupGuide: Record<
  string,
  {
    fitFor: string;
    preparation: string;
    toolAction: string;
    toolWhere: string;
    toolSuccess: string;
  }
> = {
  "deepseek-opencode": {
    fitFor: "适合想先用中文环境起步、愿意先完成基础安装，再慢慢熟悉 AI 编程工具的人。",
    preparation: "本页会带你装好 VS Code、Node.js、Git，并完成 DeepSeek + OpenCode 的首次登录准备。",
    toolAction: "安装并打开 OpenCode，按界面提示登录或填写 DeepSeek 相关授权信息，然后进入一个空白文件夹试着发出第一条指令。",
    toolWhere: "先登录 DeepSeek 账户，再按照 OpenCode 官方安装说明完成安装与登录。",
    toolSuccess: "你能打开 OpenCode，看到可用的 DeepSeek 配置或聊天入口，并能准备开始第一个最小练习。",
  },
  "qwen-lingma": {
    fitFor: "适合更希望使用中文界面、图形化体验更友好的入门用户。",
    preparation: "本页会带你装好基础开发环境，并完成通义灵码的安装与登录前准备。",
    toolAction: "打开 VS Code 插件市场，搜索并安装通义灵码。安装后点击插件入口，完成阿里云或通义账号登录。",
    toolWhere: "在 VS Code 左侧扩展面板中搜索“通义灵码”，按插件页面提示登录。",
    toolSuccess: "VS Code 里能看到通义灵码入口，点击后可以正常打开并处于已登录状态。",
  },
  "doubao-trae": {
    fitFor: "适合想先尝试国内路线，同时愿意比较不同 AI 工具体验的人。",
    preparation: "本页会带你装好基础环境，并完成 TRAE 的安装、打开和首次登录准备。",
    toolAction: "下载安装并打开 TRAE，按路线文案选择豆包或火山方舟相关入口，完成登录或授权。",
    toolWhere: "按 TRAE 官方下载页面完成安装，再在工具内找到账号登录或模型设置入口。",
    toolSuccess: "你能正常打开 TRAE，进入工具主界面，并看到可继续开始练习的输入区域或配置入口。",
  },
  "qianfan-wenxin-kuaima": {
    fitFor: "适合已经习惯国内云产品生态，希望继续沿着熟悉平台往下走的人。",
    preparation: "本页会带你装好基础环境，并完成文心快码的安装和登录准备。",
    toolAction: "在你的开发工具中安装文心快码，打开插件后完成百度智能云相关登录或授权。",
    toolWhere: "优先在 VS Code 插件市场搜索“文心快码”，然后按插件引导完成登录。",
    toolSuccess: "你能在开发工具里看到文心快码入口，并确认它已经成功登录，可以继续开始第一个练习。",
  },
  "chatgpt-codex-cli": {
    fitFor: "适合愿意接触终端、希望更早熟悉命令行协作方式的用户。",
    preparation: "本页会带你装好 VS Code、Node.js、Git，并完成 ChatGPT + Codex CLI 的登录准备。",
    toolAction: "在终端安装并打开 Codex CLI，按提示完成 ChatGPT 登录，然后进入一个空文件夹准备做第一个最小练习。",
    toolWhere: "先确保能正常访问 ChatGPT，再根据 Codex CLI 安装说明在终端完成安装和登录。",
    toolSuccess: "终端里能识别 Codex CLI 命令，你也已经完成登录，准备开始第一个小练习。",
  },
  "claude-claude-code": {
    fitFor: "适合希望让 AI 更像搭档，愿意接受终端工作流的用户。",
    preparation: "本页会带你装好基础环境，并完成 Claude Code 的安装和登录前准备。",
    toolAction: "在终端安装 Claude Code，打开后按提示完成 Claude 账户登录，然后准备进入一个测试文件夹试跑。",
    toolWhere: "先确认 Claude 账户可用，再根据 Claude Code 的安装说明完成终端安装与登录。",
    toolSuccess: "终端能识别 Claude Code 命令，工具可以打开，并显示你已经登录成功。",
  },
  "gemini-gemini-cli": {
    fitFor: "适合想尝试另一条国际路线，愿意做基础命令行配置的人。",
    preparation: "本页会带你装好基础环境，并完成 Gemini CLI 的安装与登录准备。",
    toolAction: "在终端安装 Gemini CLI，完成账户登录或授权后，进入一个测试目录准备开始最小练习。",
    toolWhere: "先确认 Gemini 账户可用，再按 Gemini CLI 官方说明完成安装和登录。",
    toolSuccess: "终端可以识别 Gemini CLI 命令，登录完成后能继续开始第一个练习。",
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
  const practiceCommand = "node -v\ngit --version";

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
          description="这是一页静态但可执行的安装清单。你只需要照着点、照着装、照着输命令，就能完成最小准备。"
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
                    <p className="text-xs text-muted-foreground">这条路线适合什么人</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{guide.fitFor}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-xs text-muted-foreground">本页会带你完成什么</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{guide.preparation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-panel space-y-5 p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">B. 安装步骤</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  建议你按顺序完成。每一步都写了“去哪里做”和“看到什么算成功”。
                </p>
              </div>

              <div className="grid gap-4">
                {setupSteps.map((step) => (
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
                  </section>
                ))}
              </div>
            </div>

            <div className="surface-panel space-y-5 p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">C. 最小命令练习</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  打开终端，把下面两行命令原样输入。只要都能返回版本号，说明你的基础环境已经装好了。
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-50">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Terminal</p>
                <pre className="mt-3 overflow-x-auto text-sm leading-7">
                  <code>{practiceCommand}</code>
                </pre>
              </div>

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
                如果你已经完成上面的四步，并且命令练习能返回版本号，就可以进入项目创建页了。
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm leading-6 text-muted-foreground">
              还没完成也没关系。你可以先返回路线选择重新挑路线，或者留在当前页继续按步骤安装。
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
              小提醒：这次是静态教程页版本，不会自动检测你电脑是否真的安装成功。你只需要以命令输出和工具能正常打开为准。
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
