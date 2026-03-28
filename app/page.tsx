import { FAQSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { StatusCard } from "@/components/cards/status-card";
import { SectionHeader } from "@/components/ui/section-header";
import { statusOptions } from "@/lib/data/status-options";

const outcomes = [
  "路线选择：知道哪种模型 + 工具组合更适合你",
  "安装引导：知道下一步该装什么、怎么开始",
  "项目设计书：把模糊想法整理成清晰方案",
  "执行拆解：形成可以直接照着做的任务列表",
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="pb-8">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-3">
            {statusOptions.map((item) => (
              <StatusCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SectionHeader
            eyebrow="你将获得什么"
            title="不是一堆术语，而是一条能继续走下去的起步路径"
            description="这一版先把最关键的四件事展示清楚，让用户知道这个产品最后会帮自己走到哪里。"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {outcomes.map((item) => (
              <div key={item} className="surface-panel p-6">
                <p className="text-base leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
