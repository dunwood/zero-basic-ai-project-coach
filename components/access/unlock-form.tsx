"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACCESS_ACTIVATION_COOKIE_KEY,
  ACCESS_ACTIVATION_STORAGE_KEY,
  ACCESS_COOKIE_MAX_AGE_SECONDS,
  isValidAccessCode,
  normalizeAccessCode,
} from "@/lib/access-codes";

type ActivationState = {
  code: string;
  activatedAt: string;
};

function readStoredActivation() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(ACCESS_ACTIVATION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ActivationState;

    if (!parsed.code || !isValidAccessCode(parsed.code)) {
      window.localStorage.removeItem(ACCESS_ACTIVATION_STORAGE_KEY);
      return null;
    }

    return {
      code: normalizeAccessCode(parsed.code),
      activatedAt: parsed.activatedAt,
    };
  } catch {
    window.localStorage.removeItem(ACCESS_ACTIVATION_STORAGE_KEY);
    return null;
  }
}

function persistActivationCookie(code: string) {
  document.cookie = `${ACCESS_ACTIVATION_COOKIE_KEY}=${encodeURIComponent(code)}; Path=/; Max-Age=${ACCESS_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function UnlockForm({
  nextPath = "/routes",
  submitLabel = "验证访问码",
}: {
  nextPath?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activatedCode, setActivatedCode] = useState("");
  const [activatedAt, setActivatedAt] = useState("");
  useEffect(() => {
    const saved = readStoredActivation();

    if (!saved) {
      return;
    }

    queueMicrotask(() => {
      persistActivationCookie(saved.code);
      setIsUnlocked(true);
      setActivatedCode(saved.code);
      setActivatedAt(saved.activatedAt);
      setMessage("本机已激活，刷新后状态仍会保留。");

      if (nextPath && nextPath !== "/") {
        router.replace(nextPath);
      }
    });
  }, [nextPath, router]);

  const activatedTimeText = useMemo(() => {
    if (!activatedAt) {
      return "";
    }

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(activatedAt));
  }, [activatedAt]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeAccessCode(input);

    if (!isValidAccessCode(normalized)) {
      setIsUnlocked(false);
      setActivatedCode("");
      setActivatedAt("");
      setMessage("访问码无效");
      return;
    }

    const nextActivation = {
      code: normalized,
      activatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(ACCESS_ACTIVATION_STORAGE_KEY, JSON.stringify(nextActivation));
    persistActivationCookie(nextActivation.code);

    setIsUnlocked(true);
    setActivatedCode(nextActivation.code);
    setActivatedAt(nextActivation.activatedAt);
    setMessage("访问已解锁，正在进入下一步。");
    setInput("");

    if (nextPath && nextPath !== "/") {
      router.replace(nextPath);
      return;
    }

    router.refresh();
  }

  return (
    <section className="surface-panel max-w-3xl space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">输入访问码</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          输入有效访问码后，会把激活状态保存在当前浏览器本地，并同步写入访问 cookie。这样刷新页面后状态仍会保留，核心页面也能正常放行。
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="access-code" className="text-sm font-medium text-slate-900">
            访问码
          </label>
          <input
            id="access-code"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="请输入访问码"
            autoComplete="off"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm uppercase tracking-wide text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {submitLabel}
          </button>
          <p className={`text-sm ${isUnlocked ? "text-green-700" : "text-red-600"}`}>
            {message || "输入正确的访问码后即可通过。"}
          </p>
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-white p-5 text-sm leading-6">
        <p className="font-medium text-slate-900">当前状态</p>
        {isUnlocked ? (
          <div className="mt-3 space-y-1 text-slate-700">
            <p>已激活</p>
            <p>当前访问码：{activatedCode}</p>
            {activatedTimeText ? <p>激活时间：{activatedTimeText}</p> : null}
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">当前尚未激活。</p>
        )}
      </div>
    </section>
  );
}
