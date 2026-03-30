"use client";

import { useEffect, useState } from "react";

type DisclaimerDialogProps = {
  buttonLabel?: string;
  buttonClassName?: string;
};

const dialogTitle = "用户服务与免责声明";

export function DisclaimerDialog({
  buttonLabel = "查看完整声明",
  buttonClassName = "inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900",
}: DisclaimerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className={buttonClassName} onClick={() => setIsOpen(true)}>
        {buttonLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{dialogTitle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">请在使用前完整阅读以下内容。</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-border px-3 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
              >
                关闭
              </button>
            </div>

            <div className="max-h-[calc(90vh-84px)] overflow-y-auto px-6 py-5 text-sm leading-7 text-slate-700">
              <div className="space-y-5">
                <p>
                  欢迎访问 “哲学园 AI 编程研究站”（coach.zhexueyuan.com）。
                  本站致力于分享作者在 AI 编程领域的探索实践、经验总结与演示文档，旨在为同好者提供技术参考与学习支持。
                </p>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-900">一、声明性质</h3>
                  <p>
                    本站内容均为作者基于个人学习、研究与实践所整理的技术经验总结与演示文档，主要用于知识分享、学习参考与研究交流。
                    本站并非商业性培训机构，亦不构成电信业务经营服务。
                    本站提供的访问凭证（注册码），仅作为本在线文档与相关内容的阅读/访问凭证，不构成软件产品销售、预付式消费服务或其他形式的商业功能交付承诺。
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-900">二、免责声明</h3>
                  <div className="space-y-3">
                    <p>
                      1. 内容仅供参考
                      本站所分享的 AI 编程方法、代码示例、工具使用经验、操作流程与逻辑分析，仅供学习、研究与个人实践参考。作者不对相关内容在您本地设备、网络环境或具体项目中的适用性、准确性、完整性或运行结果作出保证。
                    </p>
                    <p>
                      2. 使用风险自负
                      AI 模型具有不确定性，其生成内容可能存在错误、遗漏、偏差或不符合特定场景要求。用户在实际使用本站内容或 AI 生成结果时，应自行审慎判断并独立核实其真实性、合法性、安全性与适用性。因使用本站内容而产生的技术故障、数据损失、项目失败、第三方争议或其他后果，作者不承担责任。
                    </p>
                    <p>
                      3. 外部服务风险
                      本站部分内容可能涉及第三方平台、工具、网站或服务。相关服务的可用性、稳定性、访问速度、政策调整与功能变化，不受作者控制。若因网络环境、第三方平台限制、服务中断、版本变更或其他外部原因导致使用异常，作者将尽力维护与更新，但不承诺持续可用或 100% 在线。
                    </p>
                    <p>
                      4. 不构成专业建议
                      本站内容不构成法律、财务、经营、投资、工程、安全或其他专业意见。用户如需将相关内容用于正式业务、商业项目或高风险场景，请自行咨询相应专业人士。
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-900">三、使用规范</h3>
                  <div className="space-y-3">
                    <p>
                      1. 合理使用
                      注册码仅供获得访问权限的用户个人学习与阅读使用。请勿以任何方式对本站内容进行恶意抓取、批量复制、破解、非法传播或用于其他不当用途。
                    </p>
                    <p>
                      2. 版权保护
                      本站文字、图形、结构设计、课程组织方式及原创内容，除另有说明外，均由作者整理或创作。请尊重知识产权，未经许可，不得擅自篡改、倒卖、镜像、上传至公共资源平台或进行其他商业性传播。
                    </p>
                    <p>
                      3. 违规处理
                      如发现存在明显异常访问、恶意传播、非法转载或其他不当使用行为，作者有权采取必要措施，包括但不限于取消访问资格、停止提供内容更新或保留进一步追究的权利。
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-900">四、服务协议</h3>
                  <p>
                    获取、输入或使用访问码的行为，视为您已充分阅读、理解并接受本声明全部内容。
                    若您对本站内容有任何建议或反馈，欢迎通过相关平台私信与作者交流。
                  </p>
                </section>
                <p className="border-t border-border pt-4 text-sm font-medium text-slate-900">
                  Copyrigh
                  <span className="relative inline-block">
                    t
                    <span className="pointer-events-none absolute -right-2 -top-1 text-[0.7em] leading-none">
                      ©
                    </span>
                  </span>{" "}
                  2026 哲学园 | 个人技术分享站 | 严禁商业非法转载。
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
