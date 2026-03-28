import { faqItems } from "@/lib/data/faq";
import { SectionHeader } from "@/components/ui/section-header";

export function FAQSection() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="常见问题"
          title="先把最常见的担心说清楚"
          description="这些问题是很多刚开始接触 AI 做项目的人最容易卡住的地方。"
        />

        <div className="grid gap-4">
          {faqItems.map((item) => (
            <article key={item.question} className="surface-panel p-6">
              <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
