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

type ToolCard = {
  name: string;
  whatToDo: string;
  whereToGo: string;
  buttonLabel: string;
  href?: string;
  reasonWhenDisabled?: string;
};

type ToolGuide = {
  fitFor: string;
  preparation: string;
};

const baseTools: ToolCard[] = [
  {
    name: "VS Code",
    whatToDo: "先安装编辑器，后面写代码、打开项目、使用插件都会用到它。",
    whereToGo: "访问 VS Code 官网，下载安装包并完成安装。",
    buttonLabel: "打开 VS Code 官网",
    href: "https://code.visualstudio.com/",
  },
  {
    name: "Node.js",
    whatToDo: "安装 Node.js 的 LTS 版本，后面运行前端项目和命令行工具都会依赖它。",
    whereToGo: "访问 Node.js 官网，选择 LTS 版本下载安装。",
    buttonLabel: "打开 Node.js 官网",
    href: "https://nodejs.org/",
  },
  {
    name: "Git",
    whatToDo: "安装 Git，后面提交代码、推送仓库、切换版本都会用到它。",
    whereToGo: "访问 Git 官网，下载适合你系统的安装包并完成安装。",
    buttonLabel: "打开 Git 官网",
    href: "https://git-scm.com/downloads",
  },
];

const toolGuides: Record<string, ToolGuide> = {
  "deepseek-opencode": {
    fitFor: "适合先用中文环境起步，再慢慢熟悉 AI 编程工具的人。",
    preparation: "本页会先带你装好基础工具，再进入 DeepSeek 和 OpenCode 这条路线。",
  },
  "qwen-lingma": {
    fitFor: "适合更偏向中文界面，想先从图形化体验开始的新手。",
    preparation: "本页会先带你装好基础工具，再进入通义千问和通义灵码这条路线。",
  },
  "doubao-trae": {
    fitFor: "适合想先尝试国内路线，同时愿意比较不同 AI 工具体验的人。",
    preparation: "本页会先带你装好基础工具，再进入豆包 / 火山方舟和 TRAE 这条路线。",
  },
  "qianfan-wenxin-kuaima": {
    fitFor: "适合已经习惯国内云平台生态，希望沿着熟悉平台继续往下走的人。",
    preparation: "本页会先带你装好基础工具，再进入百度千帆 / 文心和文心快码这条路线。",
  },
  "chatgpt-codex-cli": {
    fitFor: "适合愿意接触终端，希望更早熟悉命令行协作方式的用户。",
    preparation: "本页会先带你装好基础工具，再进入 ChatGPT 和 Codex 这条路线。",
  },
  "claude-claude-code": {
    fitFor: "适合希望 AI 更像搭档，并愿意接受终端工作流的用户。",
    preparation: "本页会先带你装好基础工具，再进入 Claude 和 Claude Code 这条路线。",
  },
  "gemini-gemini-cli": {
    fitFor: "适合想尝试另一条国际路线，并愿意做基础命令行配置的人。",
    preparation: "本页会先带你装好基础工具，再进入 Gemini 和 Gemini CLI 这条路线。",
  },
};

const modelToolsByRoute: Record<string, ToolCard[]> = {
  "deepseek-opencode": [
    {
      name: "DeepSeek",
      whatToDo: "先确认你能正常使用 DeepSeek 账号或平台入口，后面 OpenCode 才能接上对应模型。",
      whereToGo: "访问 DeepSeek 官网，确认网页端或开放平台可正常使用。",
      buttonLabel: "打开 DeepSeek 官网",
      href: "https://www.deepseek.com/",
    },
  ],
  "qwen-lingma": [
    {
      name: "通义千问",
      whatToDo: "先确认你能正常进入通义千问或相关账号体系，后面再接入编程工具。",
      whereToGo: "访问通义官网，确认账号和模型入口可正常使用。",
      buttonLabel: "打开通义官网",
      href: "https://tongyi.aliyun.com/",
    },
  ],
  "doubao-trae": [
    {
      name: "豆包",
      whatToDo: "先确认你能正常打开豆包网页入口，后面需要登录或对照模型入口使用。",
      whereToGo: "访问豆包官网，确认账号可正常登录。",
      buttonLabel: "打开豆包官网",
      href: "https://www.doubao.com/",
    },
    {
      name: "火山方舟",
      whatToDo: "如果你打算按开发者路线接模型，这里先确认火山方舟入口和文档可正常打开。",
      whereToGo: "访问火山方舟官方文档，查看产品简介和快速入门。",
      buttonLabel: "打开火山方舟文档",
      href: "https://www.volcengine.com/docs/82379",
    },
  ],
  "qianfan-wenxin-kuaima": [
    {
      name: "百度千帆",
      whatToDo: "先确认你能正常进入百度千帆平台，后面接模型和控制台都会从这里开始。",
      whereToGo: "访问百度千帆官方社区 / 平台入口，确认账号可正常使用。",
      buttonLabel: "打开百度千帆入口",
      href: "https://qianfan.cloud.baidu.com/qianfandev",
    },
    {
      name: "文心大模型",
      whatToDo: "先了解文心模型入口和产品页面，确认后面要接的就是这一套模型能力。",
      whereToGo: "访问百度智能云文心大模型产品页，查看模型入口和说明。",
      buttonLabel: "打开文心大模型官网",
      href: "https://cloud.baidu.com/product/model.html",
    },
  ],
  "chatgpt-codex-cli": [
    {
      name: "ChatGPT",
      whatToDo: "先确认你能正常登录 ChatGPT 账号，后面使用 Codex 会直接依赖这个账号体系。",
      whereToGo: "访问 ChatGPT 官网，确认账号可正常登录。",
      buttonLabel: "打开 ChatGPT 官网",
      href: "https://chatgpt.com/",
    },
  ],
  "claude-claude-code": [
    {
      name: "Claude",
      whatToDo: "先确认你有可用的 Claude 账号或 Anthropic 入口，后面 Claude Code 会用到它。",
      whereToGo: "访问 Anthropic 的 Claude 入口说明页，确认账号和产品入口可用。",
      buttonLabel: "打开 Claude 入口说明",
      href: "https://www.anthropic.com/max",
    },
  ],
  "gemini-gemini-cli": [
    {
      name: "Gemini",
      whatToDo: "先确认你有可用的 Gemini / Google 账号入口，后面 Gemini CLI 会使用这套体系。",
      whereToGo: "访问 Gemini 官网，确认入口和账号可正常使用。",
      buttonLabel: "打开 Gemini 官网",
      href: "https://gemini.google.com/",
    },
  ],
};

const codingToolsByRoute: Record<string, ToolCard[]> = {
  "deepseek-opencode": [
    {
      name: "OpenCode",
      whatToDo: "这是本地编程工具，先看安装说明并完成安装，后面再回到本页继续。",
      whereToGo: "访问 OpenCode 官方文档，按安装说明完成本地安装。",
      buttonLabel: "查看 OpenCode 安装说明",
      href: "https://opencode.ai/docs/",
    },
  ],
  "qwen-lingma": [
    {
      name: "通义灵码",
      whatToDo: "这是编程工具本体，先进入官网或下载入口，按页面说明安装到你的开发环境里。",
      whereToGo: "访问通义灵码官网，按照下载 / 插件说明完成安装。",
      buttonLabel: "打开通义灵码官网",
      href: "https://lingma.aliyun.com/lingma/",
    },
  ],
  "doubao-trae": [
    {
      name: "TRAE",
      whatToDo: "这是本地编程工具，先去官网下载安装，再回到本页继续下一步。",
      whereToGo: "访问 TRAE 官网，下载并安装 TRAE IDE。",
      buttonLabel: "打开 TRAE 官网",
      href: "https://www.trae.ai/",
    },
  ],
  "qianfan-wenxin-kuaima": [
    {
      name: "文心快码",
      whatToDo: "这是编程工具本体，先去官方文档或产品页确认入口，再完成安装或开通。",
      whereToGo: "访问文心快码官方文档，查看产品说明和安装 / 开通入口。",
      buttonLabel: "打开文心快码文档",
      href: "https://comate.baidu.com/docs/%E4%BA%A7%E5%93%81%E5%AE%9A%E4%BB%B7/%E4%BA%A7%E5%93%81%E5%AE%9A%E4%BB%B7.html",
    },
  ],
  "chatgpt-codex-cli": [
    {
      name: "Codex CLI",
      whatToDo: "这是本地命令行工具，先看官方入门页，再按安装说明装到你的电脑上。",
      whereToGo: "访问 Codex 官方入门页，按提示安装并登录。",
      buttonLabel: "打开 Codex 入门页",
      href: "https://chatgpt.com/features/codex-get-started",
    },
  ],
  "claude-claude-code": [
    {
      name: "Claude Code",
      whatToDo: "这是本地命令行工具，先看官方概览和安装命令，再回到本页继续。",
      whereToGo: "访问 Claude Code 官方文档，按说明完成安装和登录。",
      buttonLabel: "打开 Claude Code 文档",
      href: "https://docs.anthropic.com/en/docs/claude-code/overview",
    },
  ],
  "gemini-gemini-cli": [
    {
      name: "Gemini CLI",
      whatToDo: "这是本地命令行工具，先看官方仓库和安装方式，再回到本页继续。",
      whereToGo: "访问 Gemini CLI 官方仓库，按 README 里的安装方式完成安装。",
      buttonLabel: "打开 Gemini CLI 官方仓库",
      href: "https://github.com/google-gemini/gemini-cli",
    },
  ],
};

function ToolSection({
  title,
  description,
  tools,
}: {
  title: string;
  description: string;
  tools: ToolCard[];
}) {
  return (
    <section className="surface-panel space-y-5 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <article key={tool.name} className="rounded-3xl border border-border bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-slate-900">要做什么</dt>
                <dd className="mt-1 leading-6 text-slate-700">{tool.whatToDo}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">去哪里做</dt>
                <dd className="mt-1 leading-6 text-slate-700">{tool.whereToGo}</dd>
              </div>
            </dl>

            {tool.href ? (
              <a
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                {tool.buttonLabel}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400"
              >
                {tool.buttonLabel}
              </button>
            )}

            <p className="mt-3 text-sm text-muted-foreground">
              {tool.reasonWhenDisabled ?? "做完后回到本页继续下一步。"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
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
              { label: "返回上一步", type: "back", fallbackHref: "/routes" },
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

  const guide = toolGuides[route.id];
  const modelTools = modelToolsByRoute[route.id] ?? [];
  const codingTools = codingToolsByRoute[route.id] ?? [];
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
            { label: "返回上一步", type: "back", fallbackHref: "/routes" },
          ]}
        />

        <SectionHeader
          eyebrow="安装教程"
          title={`先把 ${route.name} 装好，再开始创建项目`}
          description="这是一个可执行指导书。你按顺序装基础工具、确认主模型入口、进入编程工具，再回来继续下一步。"
        />

        <div className="surface-panel space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
              {route.recommendationTag}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              安装难度：{route.installDifficulty}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs text-muted-foreground">这条路线适合谁</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{guide.fitFor}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs text-muted-foreground">这一页会带你完成什么</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{guide.preparation}</p>
            </div>
          </div>
        </div>

        <ToolSection
          title="第一组：安装基础工具"
          description="先把基础开发工具装好。它们都是本地工具，网页不能直接替你打开本地软件，所以先去官网安装，再回到这里继续。"
          tools={baseTools}
        />

        <ToolSection
          title="第二组：选择主模型工具"
          description="这一组是当前路线会用到的主模型入口。先确认账号和入口可用，后面再接到编程工具里。"
          tools={modelTools}
        />

        <ToolSection
          title="第三组：进入编程工具"
          description="这一组是你真正动手写项目时会用到的编程工具。它们大多是本地工具或命令行工具，先看官网或安装说明，再回到这里继续。"
          tools={codingTools}
        />

        <section className="surface-panel space-y-5 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">第四组：练习基础命令</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              安装完成后，把下面两条命令分别运行一遍。网页不能直接弹出你电脑里的终端，请手动打开 PowerShell、命令提示符或 VS Code 终端，再粘贴命令运行。
            </p>
          </div>

          <SetupCommandPanel commands={practiceCommands} />

          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900">
            如果 `node -v` 和 `git --version` 都返回了版本号，就说明你的基础环境已经准备好了，可以进入项目创建页继续。
          </div>
        </section>

        <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">准备好了就继续</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              如果你已经完成上面的步骤，就回到主流程继续创建项目。做完后也可以随时回到这一页重新核对。
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
