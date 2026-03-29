export type ActionLinkItem = {
  label: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  helperText?: string;
};

export const commonActionLinks = {
  github: {
    label: "去打开 GitHub",
    href: "https://github.com/",
    external: true,
    helperText: "做完后返回这里继续。",
  },
  cloudflare: {
    label: "去打开 Cloudflare",
    href: "https://dash.cloudflare.com/",
    external: true,
    helperText: "做完后返回这里继续。",
  },
  githubRepoPlaceholder: {
    label: "去打开 GitHub 仓库",
    disabled: true,
    helperText: "当前项目还没有绑定具体仓库，先手动创建后再回来继续。",
  },
  aiToolPlaceholder: {
    label: "去打开 AI 编程工具",
    disabled: true,
    helperText: "当前项目还没有绑定具体工具入口，先按你的路线手动打开后再回来继续。",
  },
  localVerifyPlaceholder: {
    label: "去本地验证",
    disabled: true,
    helperText: "请在你自己的终端里运行验证命令，完成后返回这里继续。",
  },
  gitCommitPlaceholder: {
    label: "去执行 git commit",
    disabled: true,
    helperText: "请在本地终端完成提交，完成后返回这里继续。",
  },
  gitPushPlaceholder: {
    label: "去执行 git push",
    disabled: true,
    helperText: "请在本地终端完成推送，完成后返回这里继续。",
  },
} satisfies Record<string, ActionLinkItem>;

export const routeToolActionLinks: Partial<Record<string, ActionLinkItem>> = {
  "chatgpt-codex-cli": {
    label: "去打开 Codex",
    href: "https://chatgpt.com/codex",
    external: true,
    helperText: "做完后返回这里继续。",
  },
  "claude-claude-code": {
    label: "去打开 Claude Code",
    href: "https://docs.anthropic.com/en/docs/claude-code/overview",
    external: true,
    helperText: "做完后返回这里继续。",
  },
  "gemini-gemini-cli": {
    label: "去打开 Gemini CLI",
    href: "https://github.com/google-gemini/gemini-cli",
    external: true,
    helperText: "做完后返回这里继续。",
  },
};
