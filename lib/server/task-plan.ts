import type { ProjectRecord } from "@/lib/types/project";
import { buildDesignBrief } from "@/lib/server/design-brief";

export type TaskPlanItem = {
  title: string;
  description: string;
  tag: "页面" | "接口" | "数据" | "验证";
};

export type TaskPlanPhase = {
  title: string;
  description: string;
  items: TaskPlanItem[];
};

export type TaskPlan = {
  summary: string;
  phases: TaskPlanPhase[];
};

export type TaskPlanSeedItem = {
  phaseKey: string;
  phaseTitle: string;
  title: string;
  description: string;
  sortOrder: number;
};

function shortText(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function buildTaskPlan(project: ProjectRecord): TaskPlan | null {
  const brief = buildDesignBrief(project);

  if (!brief) {
    return null;
  }

  const targetUsers = shortText(brief.targetUsers, "目标用户");
  const coreProblem = shortText(brief.coreProblem, "核心问题");
  const firstFeature = brief.coreFeatures[0] ?? "完成项目最核心的用户路径";

  return {
    summary: `${project.title} 的第一版任务清单已经基于当前设计书预览整理完成，可以按阶段逐步推进。`,
    phases: [
      {
        title: "项目准备",
        description: "先把项目方向、首个页面和最小范围确认清楚，避免一开始做得过大。",
        items: [
          {
            title: `确认首批用户是“${targetUsers}”`,
            description: "把首批用户写清楚，确保后续页面和功能都围绕同一类人展开。",
            tag: "验证",
          },
          {
            title: `把核心问题统一为“${coreProblem}”`,
            description: "让后续页面、文案和功能说明都围绕同一个核心问题组织。",
            tag: "验证",
          },
          {
            title: "定义最小可用版本范围",
            description: "只保留最关键的 1 到 3 个能力，避免第一版范围失控。",
            tag: "页面",
          },
        ],
      },
      {
        title: "页面与交互实现",
        description: "先完成用户能看到、能点击、能走通的关键界面与跳转。",
        items: [
          {
            title: "搭建首页或首个入口页",
            description: "明确用户进入产品后第一眼看到什么，以及第一步该点哪里。",
            tag: "页面",
          },
          {
            title: `优先实现“${firstFeature}”对应的交互`,
            description: "把最重要的流程先做通，再逐步补充次要细节。",
            tag: "页面",
          },
          {
            title: "补齐空状态、错误提示和跳转路径",
            description: "保证用户在输入为空、提交失败或数据缺失时也知道下一步该做什么。",
            tag: "页面",
          },
        ],
      },
      {
        title: "数据与接口实现",
        description: "把项目最核心的信息保存和读取能力补齐，让页面不只是静态展示。",
        items: [
          {
            title: "梳理需要保存的核心字段",
            description: "优先覆盖项目标题、项目想法、关键澄清回答等最必要的数据。",
            tag: "数据",
          },
          {
            title: "补齐创建、读取和更新接口",
            description: "让前端页面能真正把数据提交到数据库，并正确回填。",
            tag: "接口",
          },
          {
            title: "处理表单提交与回填逻辑",
            description: "保证用户再次进入页面时，之前输入的关键信息仍然可见。",
            tag: "数据",
          },
        ],
      },
      {
        title: "验证与上线准备",
        description: "在继续往后扩展前，先把当前闭环彻底跑顺。",
        items: [
          {
            title: "走通从项目创建到设计书预览的完整路径",
            description: "逐页检查项目创建、需求澄清、设计书预览是否都能顺利打开。",
            tag: "验证",
          },
          {
            title: "检查关键接口与页面状态",
            description: "重点验证成功、失败、空状态和不存在数据时的表现。",
            tag: "验证",
          },
          {
            title: "整理上线前检查项",
            description: "确认环境变量、数据库迁移和基础文案都已经准备好。",
            tag: "验证",
          },
        ],
      },
    ],
  };
}

export function flattenTaskPlan(project: ProjectRecord): TaskPlanSeedItem[] {
  const plan = buildTaskPlan(project);

  if (!plan) {
    return [];
  }

  return plan.phases.flatMap((phase, phaseIndex) =>
    phase.items.map((item, itemIndex) => ({
      phaseKey: `phase-${phaseIndex + 1}`,
      phaseTitle: phase.title,
      title: item.title,
      description: item.description,
      sortOrder: phaseIndex * 100 + itemIndex + 1,
    })),
  );
}
