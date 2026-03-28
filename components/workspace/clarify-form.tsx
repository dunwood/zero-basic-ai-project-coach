"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { clarifyQuestions } from "@/lib/constants/clarify-questions";
import type { ClarificationAnswers } from "@/lib/types/project";

type ClarifyFormProps = {
  projectId: string;
  initialAnswers: ClarificationAnswers;
};

export function ClarifyForm({ projectId, initialAnswers }: ClarifyFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<ClarificationAnswers>(initialAnswers);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateAnswer(key: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (const question of clarifyQuestions) {
      if (!answers[question.key]?.trim()) {
        setErrorMessage("请先完成所有澄清回答。");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`/api/projects/${projectId}/clarify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "澄清回答保存失败，请稍后再试。");
      }

      router.push(`/workspace/${projectId}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "澄清回答保存失败，请稍后再试。";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {clarifyQuestions.map((question, index) => (
        <div key={question.key} className="rounded-2xl border border-border bg-white px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">问题 {index + 1}</p>
          <label htmlFor={question.key} className="mt-2 block text-sm font-medium leading-6 text-slate-900">
            {question.label}
          </label>
          <textarea
            id={question.key}
            value={answers[question.key] ?? ""}
            onChange={(event) => updateAnswer(question.key, event.target.value)}
            rows={4}
            className="mt-3 w-full rounded-2xl border border-border bg-[#fcfbf8] px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400"
            placeholder="先用你自己的话写下来，后面我们再继续帮你整理。"
          />
        </div>
      ))}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "正在保存澄清回答..." : "保存澄清回答"}
        </button>
        <p className="text-sm text-muted-foreground">保存成功后会返回工作区，并把项目状态更新为已完成澄清。</p>
      </div>
    </form>
  );
}
