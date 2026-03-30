"use client";

import { useEffect, useState } from "react";
import {
  ensureBrowserProjectTasks,
  getBrowserProjectById,
} from "@/lib/client/project-store";
import type { ProjectRecord } from "@/lib/types/project";

type LoadMode = "plain" | "ensureTasks";

export function useBrowserProject(projectId: string, mode: LoadMode = "plain") {
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const nextProject =
        mode === "ensureTasks" ? ensureBrowserProjectTasks(projectId) : getBrowserProjectById(projectId);
      setProject(nextProject);
    } catch (error) {
      console.error("Browser project load failed:", error);
      setProject(null);
    } finally {
      setIsLoaded(true);
    }
  }, [mode, projectId]);

  return {
    project,
    isLoaded,
    reload() {
      const nextProject =
        mode === "ensureTasks" ? ensureBrowserProjectTasks(projectId) : getBrowserProjectById(projectId);
      setProject(nextProject);
    },
  };
}
