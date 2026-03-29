export const ACCESS_CODES = [
  "ZHY26-AICPJ-7K9M2-XQ8LT",
  "ZHY26-AICPJ-V8D4N-P3WQY",
  "ZHY26-AICPJ-M7R2K-T9LXP",
] as const;

export const ACCESS_ACTIVATION_STORAGE_KEY = "zero-basic-ai-project-coach-access";

export type AccessCode = (typeof ACCESS_CODES)[number];

export function normalizeAccessCode(value: string) {
  return value.trim().toUpperCase();
}

export function isValidAccessCode(value: string): value is AccessCode {
  const normalized = normalizeAccessCode(value);
  return ACCESS_CODES.includes(normalized as AccessCode);
}
