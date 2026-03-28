import type {
  ProjectNextAction,
  ProjectRecord,
  ProjectStageItem,
  ProjectStageKey,
  ProjectStageState,
  ProjectTaskRecord,
  RecentProjectSummary,
} from "@/lib/types/project";

type TaskSummary = {
  total: number;
  done: number;
};

function getTaskSummary(tasks: ProjectTaskRecord[] | TaskSummary) {
  if (Array.isArray(tasks)) {
    return {
      total: tasks.length,
      done: tasks.filter((task) => task.isDone).length,
    };
  }

  return tasks;
}

function isReviewStage(status: ProjectRecord["status"] | RecentProjectSummary["status"], taskSummary: TaskSummary) {
  return status === "clarified" && taskSummary.done === 0;
}

function getTaskStageState(taskSummary: TaskSummary, isClarified: boolean): ProjectStageState {
  if (!isClarified) {
    return "upcoming";
  }

  if (taskSummary.done === 0) {
    return "upcoming";
  }

  if (taskSummary.done < taskSummary.total) {
    return "current";
  }

  return "completed";
}

export function getProjectNextAction(input: {
  id: string;
  status: ProjectRecord["status"] | RecentProjectSummary["status"];
  taskSummary: TaskSummary;
}): ProjectNextAction {
  if (input.status === "draft") {
    return {
      label: "开始澄清需求",
      href: `/workspace/${input.id}/clarify`,
      description: "先把项目目标、用户和成功标准说清楚。",
    };
  }

  if (input.status === "clarifying") {
    return {
      label: "继续澄清需求",
      href: `/workspace/${input.id}/clarify`,
      description: "继续补完澄清问题，进入更明确的方案阶段。",
    };
  }

  if (isReviewStage(input.status, input.taskSummary)) {
    return {
      label: "确认并进入任务执行",
      href: `/workspace/${input.id}/review`,
      description: "先确认这版设计书摘要已经足够清晰，再正式进入任务执行阶段。",
    };
  }

  if (input.taskSummary.done < input.taskSummary.total) {
    return {
      label: "继续执行任务",
      href: `/workspace/${input.id}/tasks`,
      description: "任务已经有进度，继续回到任务面板推进当前项目。",
    };
  }

  return {
    label: "回顾任务清单",
    href: `/workspace/${input.id}/tasks`,
    description: "当前任务已经完成，可以回顾清单并准备下一轮扩展。",
  };
}

export function getCurrentProjectStageKey(input: {
  status: ProjectRecord["status"] | RecentProjectSummary["status"];
  taskSummary: TaskSummary;
}): ProjectStageKey {
  if (input.status === "draft" || input.status === "clarifying") {
    return "clarify";
  }

  if (isReviewStage(input.status, input.taskSummary)) {
    return "review";
  }

  return "tasks";
}

export function buildProjectStages(project: ProjectRecord): ProjectStageItem[] {
  const taskSummary = getTaskSummary(project.tasks);
  const isClarified = project.status === "clarified" && Boolean(project.clarification);
  const reviewCurrent = isReviewStage(project.status, taskSummary);

  return [
    {
      key: "created",
      title: "项目创建",
      description: "项目名称和想法已经保存，可进入项目详情继续编辑。",
      href: `/workspace/${project.id}/project`,
      state: "completed",
    },
    {
      key: "clarify",
      title: "需求澄清",
      description: isClarified ? "澄清回答已完成并保存。" : "继续补完固定澄清问题列表。",
      href: `/workspace/${project.id}/clarify`,
      state: isClarified ? "completed" : "current",
    },
    {
      key: "design",
      title: "设计书预览",
      description: isClarified ? "可以查看静态整理后的设计书预览。" : "完成澄清后即可查看。",
      href: `/workspace/${project.id}/design`,
      state: isClarified ? "completed" : "upcoming",
    },
    {
      key: "review",
      title: "设计书确认",
      description: isClarified
        ? reviewCurrent
          ? "确认设计书摘要无误后，再正式进入任务执行。"
          : "设计书确认流程已经走通，可以继续回看。"
        : "完成需求澄清后，会进入设计书确认阶段。",
      href: `/workspace/${project.id}/review`,
      state: !isClarified ? "upcoming" : reviewCurrent ? "current" : "completed",
    },
    {
      key: "tasks",
      title: "任务执行",
      description: isClarified
        ? taskSummary.done > 0
          ? `当前已完成 ${taskSummary.done} / ${taskSummary.total} 项任务。`
          : "确认设计书后即可正式开始任务执行。"
        : "完成澄清后会自动进入任务拆解和执行阶段。",
      href: `/workspace/${project.id}/tasks`,
      state: getTaskStageState(taskSummary, isClarified),
    },
  ];
}

export function getProjectOverview(project: ProjectRecord) {
  const taskSummary = getTaskSummary(project.tasks);
  const nextAction = getProjectNextAction({
    id: project.id,
    status: project.status,
    taskSummary,
  });

  let currentStageTitle = "需求澄清";
  let currentStageDescription = "先把这个项目的目标、用户和成功标准整理清楚。";

  if (project.status === "clarified") {
    if (taskSummary.done === 0) {
      currentStageTitle = "设计书确认";
      currentStageDescription = "你已经完成澄清。先确认这版设计书摘要，再进入正式任务执行流程。";
    } else if (taskSummary.done < taskSummary.total) {
      currentStageTitle = "正在推进任务执行";
      currentStageDescription = "项目已经进入执行阶段，回到任务面板继续完成剩余任务。";
    } else {
      currentStageTitle = "当前阶段已完成";
      currentStageDescription = "当前任务已经全部完成，可以回顾设计书和任务清单，准备下一轮迭代。";
    }
  } else if (project.status === "clarifying") {
    currentStageTitle = "继续需求澄清";
    currentStageDescription = "项目已经进入澄清阶段，再补齐关键回答就能进入设计和执行。";
  }

  return {
    taskSummary,
    nextAction,
    currentStageKey: getCurrentProjectStageKey({
      status: project.status,
      taskSummary,
    }),
    currentStageTitle,
    currentStageDescription,
    stages: buildProjectStages(project),
  };
}

export function getRecentProjectAction(project: RecentProjectSummary) {
  return getProjectNextAction({
    id: project.id,
    status: project.status,
    taskSummary: project.taskSummary,
  });
}
