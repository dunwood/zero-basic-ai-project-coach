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

type ToolAction = {
  label: string;
  href: string;
};

type ToolCard = {
  name: string;
  purpose: string;
  installOrRegister: string;
  howToEnter: string;
  howToStart: string;
  actions: ToolAction[];
  note?: string;
};

type ToolGuide = {
  fitFor: string;
  preparation: string;
};

const baseTools: ToolCard[] = [
  {
    name: "VS Code",
    purpose: "用来打开项目、查看文件、编辑代码，也能顺手打开内置终端。",
    installOrRegister: "去 VS Code 官网下载安装包，按安装向导装好。",
    howToEnter: "安装后，在开始菜单搜索 VS Code，或双击桌面图标进入。",
    howToStart: "第一次打开后，先熟悉左侧文件栏；后面你会用它打开项目文件夹，并在菜单里进入 Terminal -> New Terminal。",
    actions: [{ label: "打开 VS Code 官网", href: "https://code.visualstudio.com/" }],
  },
  {
    name: "Node.js",
    purpose: "用来运行前端项目和命令行工具，后面的 npm、构建、启动都会依赖它。",
    installOrRegister: "去 Node.js 官网安装 LTS 版本。",
    howToEnter: "Node.js 本身不是单独打开的桌面软件，装好后会自动进入你的命令行环境。",
    howToStart: "打开 PowerShell、命令提示符或 VS Code 终端，输入 node -v，看到版本号就说明已经可用了。",
    actions: [{ label: "打开 Node.js 官网", href: "https://nodejs.org/" }],
  },
  {
    name: "Git",
    purpose: "用来保存代码版本、提交 commit、推送到 GitHub，也会参与后面的部署流程。",
    installOrRegister: "去 Git 官网下载安装包，按默认选项安装即可。",
    howToEnter: "Git 也是装进命令行里使用的工具，不会单独弹出网页窗口。",
    howToStart: "打开终端后输入 git --version，看到版本号就说明 Git 已经装好；后面你会继续用 git add、git commit、git push。",
    actions: [{ label: "打开 Git 官网", href: "https://git-scm.com/downloads" }],
  },
  {
    name: "命令行",
    purpose: "用来输入命令，比如 node -v、git --version、npm run build。",
    installOrRegister: "Windows 一般已经自带 PowerShell 和命令提示符；如果你用 VS Code，也可以直接用它的内置终端。",
    howToEnter: "可以用这三种方式进入：1. 开始菜单搜索 PowerShell。2. 开始菜单搜索 命令提示符 或 cmd。3. 在 VS Code 里打开 Terminal -> New Terminal。",
    howToStart: "打开后会看到命令输入窗口。先输入 node -v，再输入 git --version，每条命令输入后按回车运行。",
    actions: [
      {
        label: "查看 Windows Terminal 说明",
        href: "https://learn.microsoft.com/windows/terminal/",
      },
    ],
    note: "本网页不能直接弹出你电脑里的命令行窗口，需要你手动打开终端，再把命令复制进去执行。做完后回到本页继续下一步。",
  },
  {
    name: "GitHub",
    purpose: "用来保存代码、同步项目、连接 Vercel 部署。",
    installOrRegister: "去 GitHub 官网注册或登录账号，后面创建仓库并把项目 push 上去。",
    howToEnter: "在浏览器里打开 GitHub 官网，登录后就能进入你的主页和仓库列表。",
    howToStart: "第一次先完成注册或登录。后面创建仓库后，你会把本地项目推送到 GitHub，再继续接入部署。",
    actions: [
      { label: "打开 GitHub 官网", href: "https://github.com/" },
      { label: "注册 GitHub", href: "https://github.com/signup" },
    ],
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
    preparation: "本页会先带你装好基础工具，再进入豆包、火山方舟和 TRAE 这条路线。",
  },
  "qianfan-wenxin-kuaima": {
    fitFor: "适合已经习惯国内云平台生态，希望沿着熟悉平台继续往下走的人。",
    preparation: "本页会先带你装好基础工具，再进入百度千帆、文心大模型和文心快码这条路线。",
  },
  "chatgpt-codex-cli": {
    fitFor: "适合愿意接触终端，希望更早熟悉命令行协作方式的用户。",
    preparation: "本页会先带你装好基础工具，再进入 ChatGPT 和 Codex CLI 这条路线。",
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
      purpose: "这是当前路线会用到的主模型入口，后面的 OpenCode 会接这套能力。",
      installOrRegister: "去 DeepSeek 官网确认账号或入口可正常使用。",
      howToEnter: "在浏览器中打开 DeepSeek 官网，登录后进入聊天或平台入口。",
      howToStart: "先确认网页端可正常打开；如果你后面要接开发者能力，再继续看 OpenCode 的接入说明。",
      actions: [{ label: "打开 DeepSeek 官网", href: "https://www.deepseek.com/" }],
    },
  ],
  "qwen-lingma": [
    {
      name: "通义千问",
      purpose: "这是当前路线会用到的主模型入口，后面的通义灵码会围绕这套能力展开。",
      installOrRegister: "去通义官网确认账号和模型入口可正常使用。",
      howToEnter: "在浏览器中打开通义官网，登录后进入对应产品页。",
      howToStart: "先确认网页入口能正常打开，再继续安装后面的编程工具。",
      actions: [{ label: "打开通义官网", href: "https://tongyi.aliyun.com/" }],
    },
  ],
  "doubao-trae": [
    {
      name: "豆包",
      purpose: "这是当前路线的主模型网页入口，后面会作为你理解模型输出的基础。",
      installOrRegister: "去豆包官网确认账号可正常登录。",
      howToEnter: "在浏览器里打开豆包官网并登录。",
      howToStart: "先确认网页端能用，后面再按需要继续看 TRAE 或火山方舟。",
      actions: [{ label: "打开豆包官网", href: "https://www.doubao.com/" }],
    },
    {
      name: "火山方舟",
      purpose: "如果你要走更偏开发者的模型接入路线，这里是对应的平台文档入口。",
      installOrRegister: "去火山方舟官方文档查看产品说明和入口。",
      howToEnter: "在浏览器里打开火山方舟文档页。",
      howToStart: "先看清产品说明和入口结构，后面再决定是否走平台接入路线。",
      actions: [{ label: "打开火山方舟文档", href: "https://www.volcengine.com/docs/82379" }],
    },
  ],
  "qianfan-wenxin-kuaima": [
    {
      name: "百度千帆",
      purpose: "这是当前路线的主平台入口，后面模型和平台操作都会从这里开始。",
      installOrRegister: "去百度千帆官网确认账号和平台入口可正常使用。",
      howToEnter: "在浏览器里打开百度千帆入口并登录。",
      howToStart: "先确认平台入口能进入，后面再接到文心大模型和文心快码。",
      actions: [{ label: "打开百度千帆入口", href: "https://qianfan.cloud.baidu.com/qianfandev" }],
    },
    {
      name: "文心大模型",
      purpose: "这是你后面要接入的模型能力说明入口，用来确认产品和模型范围。",
      installOrRegister: "去百度智能云的文心大模型产品页查看说明。",
      howToEnter: "在浏览器里打开文心大模型官网。",
      howToStart: "先读清产品页说明，确认这条路线和你的目标匹配，再继续下一步。",
      actions: [{ label: "打开文心大模型官网", href: "https://cloud.baidu.com/product/model.html" }],
    },
  ],
  "chatgpt-codex-cli": [
    {
      name: "ChatGPT",
      purpose: "这是当前路线的主账号入口，后面的 Codex CLI 会依赖这套账号体系。",
      installOrRegister: "去 ChatGPT 官网确认账号可正常登录。",
      howToEnter: "在浏览器里打开 ChatGPT 官网并登录。",
      howToStart: "先确保网页版可用，后面再继续进入 Codex CLI 的安装说明。",
      actions: [{ label: "打开 ChatGPT 官网", href: "https://chatgpt.com/" }],
    },
  ],
  "claude-claude-code": [
    {
      name: "Claude",
      purpose: "这是当前路线的主账号和产品入口，后面的 Claude Code 会用到它。",
      installOrRegister: "去 Anthropic 的 Claude 入口页确认账号和产品入口可用。",
      howToEnter: "在浏览器里打开 Claude 入口说明页并登录。",
      howToStart: "先确认 Claude 账号可用，再继续进入 Claude Code 安装步骤。",
      actions: [{ label: "打开 Claude 入口说明", href: "https://www.anthropic.com/max" }],
    },
  ],
  "gemini-gemini-cli": [
    {
      name: "Gemini",
      purpose: "这是当前路线的主账号入口，后面的 Gemini CLI 会依赖这套入口。",
      installOrRegister: "去 Gemini 官网确认 Google 账号和入口可正常使用。",
      howToEnter: "在浏览器里打开 Gemini 官网并登录。",
      howToStart: "先确认网页端可用，后面再继续看 Gemini CLI 的安装说明。",
      actions: [{ label: "打开 Gemini 官网", href: "https://gemini.google.com/" }],
    },
  ],
};

const codingToolsByRoute: Record<string, ToolCard[]> = {
  "deepseek-opencode": [
    {
      name: "OpenCode",
      purpose: "这是本地编程工具，后面你会在这里真正开始改项目。",
      installOrRegister: "去 OpenCode 官方文档查看安装步骤。",
      howToEnter: "安装完成后，按它的文档说明从本地终端进入。",
      howToStart: "先按官方文档装好，再回到本页继续下一步。",
      actions: [{ label: "查看 OpenCode 安装说明", href: "https://opencode.ai/docs/" }],
    },
  ],
  "qwen-lingma": [
    {
      name: "通义灵码",
      purpose: "这是当前路线的编程工具本体，后面你会在这里继续写项目。",
      installOrRegister: "去通义灵码官网查看下载或插件安装说明。",
      howToEnter: "按官网说明装到 VS Code 或对应开发环境里，再从该环境进入。",
      howToStart: "先把工具装好并打开，再回到本页继续下一步。",
      actions: [{ label: "打开通义灵码官网", href: "https://lingma.aliyun.com/lingma/" }],
    },
  ],
  "doubao-trae": [
    {
      name: "TRAE",
      purpose: "这是本地编程工具，你后面会在它里面打开项目并继续开发。",
      installOrRegister: "去 TRAE 官网下载安装包。",
      howToEnter: "安装完成后，在开始菜单或桌面图标里打开 TRAE。",
      howToStart: "第一次先打开软件，熟悉界面，后面再用它打开项目。",
      actions: [{ label: "打开 TRAE 官网", href: "https://www.trae.ai/" }],
    },
  ],
  "qianfan-wenxin-kuaima": [
    {
      name: "文心快码",
      purpose: "这是当前路线的编程工具入口，后面你会在这里继续写项目。",
      installOrRegister: "去文心快码官方文档查看安装或开通入口。",
      howToEnter: "按官方说明在你的开发环境里进入对应插件或工具入口。",
      howToStart: "先确认安装方式和适用环境，再完成安装并回到本页继续。",
      actions: [
        {
          label: "打开文心快码文档",
          href: "https://comate.baidu.com/docs/%E4%BA%A7%E5%93%81%E5%AE%9A%E4%BB%B7/%E4%BA%A7%E5%93%81%E5%AE%9A%E4%BB%B7.html",
        },
      ],
    },
  ],
  "chatgpt-codex-cli": [
    {
      name: "Codex CLI",
      purpose: "这是本地命令行编程工具，后面你会在终端里用它协助改项目。",
      installOrRegister: "去 Codex 官方入门页查看安装和登录说明。",
      howToEnter: "安装完成后，按文档要求在本地终端里启动。",
      howToStart: "先看清官方安装说明，再回到本页继续下一步。",
      actions: [{ label: "打开 Codex 入门页", href: "https://chatgpt.com/features/codex-get-started" }],
    },
  ],
  "claude-claude-code": [
    {
      name: "Claude Code",
      purpose: "这是本地命令行编程工具，后面你会在终端里用它继续开发。",
      installOrRegister: "去 Claude Code 官方文档查看安装和登录说明。",
      howToEnter: "安装完成后，按文档要求从本地终端进入。",
      howToStart: "先照着官方说明完成安装，再回到本页继续下一步。",
      actions: [
        {
          label: "打开 Claude Code 文档",
          href: "https://docs.anthropic.com/en/docs/claude-code/overview",
        },
      ],
    },
  ],
  "gemini-gemini-cli": [
    {
      name: "Gemini CLI",
      purpose: "这是本地命令行编程工具，后面你会在终端里用它继续开发。",
      installOrRegister: "去 Gemini CLI 官方仓库查看安装说明。",
      howToEnter: "安装完成后，按 README 的方式从本地终端进入。",
      howToStart: "先按官方文档装好，再回到本页继续下一步。",
      actions: [
        {
          label: "打开 Gemini CLI 官方仓库",
          href: "https://github.com/google-gemini/gemini-cli",
        },
      ],
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
                <dt className="font-medium text-slate-900">这个工具是做什么的</dt>
                <dd className="mt-1 leading-6 text-slate-700">{tool.purpose}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">去哪里安装 / 注册</dt>
                <dd className="mt-1 leading-6 text-slate-700">{tool.installOrRegister}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">安装后怎么进入</dt>
                <dd className="mt-1 leading-6 text-slate-700">{tool.howToEnter}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">第一次怎么开始用</dt>
                <dd className="mt-1 leading-6 text-slate-700">{tool.howToStart}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-3">
              {tool.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {action.label}
                </a>
              ))}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {tool.note ?? "做完后回到本页继续下一步。"}
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
          description="先把基础工具装好。这里不只是给下载入口，还会告诉你装完后怎么进入、第一次怎么开始用。做完后回到本页继续下一步。"
          tools={baseTools}
        />

        <ToolSection
          title="第二组：选择主模型工具"
          description="这一组是当前路线会用到的主模型入口。先确认账号和入口可用，后面再接到编程工具里。"
          tools={modelTools}
        />

        <ToolSection
          title="第三组：进入编程工具"
          description="这一组是你真正动手写项目时会用到的编程工具。先看官网或安装说明，再回到这里继续。"
          tools={codingTools}
        />

        <section className="surface-panel space-y-5 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">第四组：练习基础命令</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              先按上面的“命令行”步骤打开 PowerShell、命令提示符或 VS Code 终端，再把下面两条命令分别运行一遍。网页不能直接弹出你电脑里的终端，只能帮你复制命令。
            </p>
          </div>

          <SetupCommandPanel commands={practiceCommands} />

          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900">
            如果 `node -v` 和 `git --version` 都返回了版本号，就说明你的基础环境已经准备好了，可以继续进入项目创建页。
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
