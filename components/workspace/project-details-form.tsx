"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProjectDetailsFormProps = {
  projectId: string;
  initialTitle: string;
  initialIdea: string;
};

export function ProjectDetailsForm({
  projectId,
  initialTitle,
  initialIdea,
}: ProjectDetailsFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [idea, setIdea] = useState(initialIdea);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextIdea = idea.trim();

    if (!nextTitle) {
      setErrorMessage("项目名称不能为空。");
      setSuccessMessage("");
      return;
    }

    if (!nextIdea) {
      setErrorMessage("项目想法不能为空。");
      setSuccessMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: nextTitle,
          idea: nextIdea,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "项目更新失败，请稍后再试。");
      }

      setTitle(nextTitle);
      setIdea(nextIdea);
      setSuccessMessage("项目信息已更新。");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "项目更新失败，请稍后再试。";
      setErrorMessage(message);
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-900">
          项目标题
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={80}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="idea" className="text-sm font-medium text-slate-900">
          项目想法
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          maxLength={2000}
          rows={8}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400"
        />
        <p className="text-xs text-muted-foreground">
          这里保持轻量编辑，只更新项目标题和项目想法。
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "正在保存..." : "保存项目信息"}
        </button>
        <p className="text-sm text-muted-foreground">保存后会留在当前页，并刷新展示结果。</p>
      </div>
    </form>
  );
}
