import Link from "next/link";

const navLinks = [
  { href: "/routes", label: "选路线" },
  { href: "/project/new", label: "开始做项目" },
  { href: "/workspace", label: "工作台" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-[#f7f6f2]/90 backdrop-blur">
      <div className="container-shell flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            AI
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">零基础 AI 项目教练</p>
            <p className="text-xs text-muted-foreground">从工具选择到项目起步</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/workspace"
            className="hidden rounded-full border border-border px-4 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:inline-flex"
          >
            工作台
          </Link>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            登录占位
          </button>
        </div>
      </div>
    </header>
  );
}
