export const clarifyQuestions = [
  {
    key: "targetUsers",
    label: "这个产品主要给谁用？",
  },
  {
    key: "coreProblem",
    label: "他们现在最核心的痛点是什么？",
  },
  {
    key: "mainFlow",
    label: "他们会怎样一步步使用这个产品？",
  },
  {
    key: "successStandard",
    label: "你怎样判断这个产品已经做到了最小可用？",
  },
] as const;

export const clarifyQuestionKeys = clarifyQuestions.map((question) => question.key);
