import type { ProjectRecord } from "@/lib/types/project";

export type DesignBrief = {
  summary: string;
  targetUsers: string;
  coreProblem: string;
  coreFeatures: string[];
  mvpScope: string[];
  outOfScope: string[];
  nextSteps: string[];
};

function splitToList(content: string) {
  return content
    .split(/[，、。,；;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureList(source: string, fallback: string[]) {
  const items = splitToList(source);
  return items.length > 0 ? items.slice(0, 5) : fallback;
}

export function buildDesignBrief(project: ProjectRecord): DesignBrief | null {
  if (project.status !== "clarified" || !project.clarification) {
    return null;
  }

  const answers = project.clarification.answers;
  const targetUsers = answers.targetUsers?.trim() || "面向需要把模糊想法整理清楚的普通用户。";
  const coreProblem =
    answers.coreProblem?.trim() || "用户当前还不能把自己的需求快速整理成清晰可执行的方案。";
  const mainFlow =
    answers.mainFlow?.trim() || "用户先输入想法，再回答关键问题，最后获得一份更清晰的设计方向。";
  const successStandard =
    answers.successStandard?.trim() || "用户可以在较短时间内拿到一版清晰、可继续开发的方案。";

  return {
    summary: `${project.title} 是一个围绕“${coreProblem}”展开的项目，目标是帮助 ${targetUsers}`,
    targetUsers,
    coreProblem,
    coreFeatures: ensureList(mainFlow, [
      "输入项目想法并快速进入工作区",
      "通过关键问题澄清需求方向",
      "把澄清结果整理成结构化设计书预览",
    ]),
    mvpScope: [
      "完成项目基础信息录入",
      "完成需求澄清问题填写与保存",
      "输出一份可阅读的设计书预览",
    ],
    outOfScope: [
      "真实 AI 对话式澄清",
      "设计书导出与多版本管理",
      "任务拆解、项目列表和登录系统",
    ],
    nextSteps: [
      `先围绕“${successStandard}”定义第一页最小体验`,
      "把核心流程拆成 2 到 3 个最小页面或模块",
      "优先验证最关键的输入、处理和结果展示链路",
    ],
  };
}
