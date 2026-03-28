import type {
  ProjectNextAction,
  ProjectRecord,
  ProjectStageItem,
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

function getTaskStageState(taskSummary: TaskSummary, isClarified: boolean): ProjectStageState {
  if (!isClarified) {
    return "upcoming";
  }

  if (taskSummary.total === 0 || taskSummary.done < taskSummary.total) {
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

  if (input.taskSummary.total === 0 || input.taskSummary.done === 0) {
    return {
      label: "进入任务清单",
      href: `/workspace/${input.id}/tasks`,
      description: "设计书已经准备好，现在开始推进第一轮执行任务。",
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

export function buildProjectStages(project: ProjectRecord): ProjectStageItem[] {
  const taskSummary = getTaskSummary(project.tasks);
  const isClarified = project.status === "clarified" && Boolean(project.clarification);

  return [
    {
      key: "created",
      title: "项目创建",
      description: "项目名称和想法已经保存。",
      href: `/workspace/${project.id}`,
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
      key: "tasks",
      title: "任务执行",
      description: isClarified
        ? taskSummary.done > 0
          ? `当前已完成 ${taskSummary.done} / ${taskSummary.total} 项任务。`
          : "任务清单已可用，准备开始执行。"
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
    if (taskSummary.total === 0 || taskSummary.done === 0) {
      currentStageTitle = "准备开始任务执行";
      currentStageDescription = "你已经完成澄清，可以直接进入任务清单，开始第一轮开发推进。";
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
