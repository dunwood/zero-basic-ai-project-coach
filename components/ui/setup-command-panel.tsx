"use client";

import { useState } from "react";

type CommandItem = {
  label: string;
  command: string;
};

type SetupCommandPanelProps = {
  commands: CommandItem[];
};

export function SetupCommandPanel({ commands }: SetupCommandPanelProps) {
  const [copiedCommand, setCopiedCommand] = useState("");

  async function handleCopy(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      window.setTimeout(() => {
        setCopiedCommand((current) => (current === command ? "" : current));
      }, 1500);
    } catch (error) {
      console.error("Copy command failed:", error);
      setCopiedCommand("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-50">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Terminal</p>

        <div className="mt-4 space-y-3">
          {commands.map((item) => {
            const isCopied = copiedCommand === item.command;

            return (
              <div
                key={item.command}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-300">{item.label}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.command)}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    {isCopied ? "已复制" : "复制"}
                  </button>
                </div>

                <pre className="mt-3 overflow-x-auto text-sm leading-7 text-slate-50">
                  <code>{item.command}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        本网页不能直接弹出你电脑里的命令行窗口。请先手动打开 PowerShell、命令提示符，或 VS
        Code 终端，再把上面的命令粘贴进去运行。
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-medium text-slate-900">Windows 新手提示</p>
        <ul className="mt-2 space-y-1">
          <li>开始菜单搜索 PowerShell。</li>
          <li>或在 VS Code 里打开 Terminal → New Terminal。</li>
        </ul>
      </div>
    </div>
  );
}
