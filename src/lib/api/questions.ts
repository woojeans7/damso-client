import { apiFetch } from "./client";
import type { FamilyMemberRole } from "./users";

export type QuestionDepth = "tiny" | "medium" | "deep";
export type QuestionSourceType = "recommendation" | "custom";
export type SentQuestionStatus = "sent" | "answered" | "cancelled" | "expired";

export interface QuestionReceiver {
  id: string;
  familyMemberId: number | null;
  familyId: number | null;
  userId: string;
  name: string;
  role: FamilyMemberRole;
  roleLabel: string;
  profileImageUrl: string | null;
}

export interface QuestionTheme {
  id: string;
  key: string;
  name: "일상" | "추억" | "고민" | string;
  category: string;
  depth: QuestionDepth;
  sortOrder: number;
}

export interface RecommendedQuestion {
  id: string;
  recommendationId: number;
  depth: QuestionDepth;
  title: string;
  content: string;
  category: string | null;
  sortOrder: number;
}

export interface SendQuestionPayload {
  recipientUserId: number;
  familyId?: number | null;
  questionText: string;
  depth: QuestionDepth;
  source: QuestionSourceType;
  recommendationId?: number | null;
}

export interface CreateQuestionRequest {
  recipientUserId: number;
  depth: QuestionDepth;
  questionText: string;
  sourceType: QuestionSourceType;
  recommendationId?: number;
}

export interface CreateQuestionResponse {
  questionSendId: string;
  recipientUserId: number;
  questionText: string;
  depth: QuestionDepth;
  source: QuestionSourceType;
  sentAt: string;
  read: boolean;
  answered: boolean;
}

type ApiRecord = Record<string, unknown>;

const ROLE_LABEL: Record<FamilyMemberRole, string> = {
  child: "자녀",
  mother: "엄마",
  father: "아빠",
};

const FALLBACK_THEMES: QuestionTheme[] = [
  { id: "일상", key: "일상", name: "일상", category: "일상", depth: "tiny", sortOrder: 1 },
  { id: "추억", key: "추억", name: "추억", category: "추억", depth: "medium", sortOrder: 2 },
  { id: "고민", key: "고민", name: "고민", category: "고민", depth: "deep", sortOrder: 3 },
];

function asRecord(input: unknown): ApiRecord {
  return input && typeof input === "object" ? (input as ApiRecord) : {};
}

function getArray(input: unknown, keys: string[]): unknown[] {
  if (Array.isArray(input)) return input;

  const record = asRecord(input);
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function getString(source: ApiRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

function getNumber(source: ApiRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }

  return fallback;
}

function getNullableNumber(source: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }

  return null;
}

function getBoolean(source: ApiRecord, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "boolean") return value;
  }

  return fallback;
}

function normalizeRole(role: string): FamilyMemberRole {
  if (role === "mother" || role === "father" || role === "child") return role;
  return "child";
}

function normalizeDepth(depth: string): QuestionDepth {
  if (depth === "tiny" || depth === "medium" || depth === "deep") return depth;
  return "tiny";
}

function getDepthByCategory(category: string): QuestionDepth {
  if (category === "추억") return "medium";
  if (category === "고민") return "deep";
  return "tiny";
}

function getTitleFromRecommendation(category: string | null, depth: QuestionDepth, questionText: string) {
  if (category === "일상" || depth === "tiny") return "요즘 하루";
  if (category === "추억" || depth === "medium") return questionText.includes("고민") ? "그때의 고민" : "그때의 기억";
  if (category === "고민" || depth === "deep") return "그때의 고민";
  return "남기고 싶은 말";
}

function normalizeReceiver(input: unknown): QuestionReceiver {
  const source = asRecord(input);
  const role = normalizeRole(getString(source, ["memberRole", "member_role", "role"], "child"));
  const userId = getString(source, ["userId", "user_id"], "");
  const displayName = getString(source, ["displayName", "display_name", "name"], "");
  const roleLabel = role === "child" ? displayName || ROLE_LABEL.child : ROLE_LABEL[role];

  return {
    id: getString(source, ["familyMemberId", "family_member_id", "id"], userId),
    familyMemberId: getNullableNumber(source, ["familyMemberId", "family_member_id", "id"]),
    familyId: getNullableNumber(source, ["familyId", "family_id"]),
    userId,
    name: displayName || roleLabel,
    role,
    roleLabel,
    profileImageUrl: getString(source, ["profileImageUrl", "profile_image_url"]) || null,
  };
}

function normalizeRecommendedQuestion(input: unknown, index: number): RecommendedQuestion {
  const source = asRecord(input);
  const recommendationId = getNumber(source, ["recommendationId", "recommendation_id", "id"], index + 1);
  const content = getString(source, ["questionText", "question_text", "content"]);
  const depth = normalizeDepth(getString(source, ["depth"], "tiny"));
  const category = getString(source, ["category"]) || null;

  return {
    id: String(recommendationId),
    recommendationId,
    depth,
    title: getString(source, ["title"]) || getTitleFromRecommendation(category, depth, content),
    content,
    category,
    sortOrder: index + 1,
  };
}

function normalizeCreateQuestionResponse(input: unknown): CreateQuestionResponse {
  const source = asRecord(input);

  return {
    questionSendId: getString(source, ["questionSendId", "question_send_id", "id"], ""),
    recipientUserId: getNumber(source, ["recipientUserId", "recipient_user_id"]),
    questionText: getString(source, ["questionText", "question_text"]),
    depth: normalizeDepth(getString(source, ["depth"], "tiny")),
    source: getString(source, ["source"], "custom") as QuestionSourceType,
    sentAt: getString(source, ["sentAt", "sent_at"]),
    read: getBoolean(source, ["read"]),
    answered: getBoolean(source, ["answered"]),
  };
}

function normalizeTheme(category: string, index: number): QuestionTheme {
  return {
    id: category,
    key: category,
    name: category,
    category,
    depth: getDepthByCategory(category),
    sortOrder: FALLBACK_THEMES.find((theme) => theme.category === category)?.sortOrder ?? index + 1,
  };
}

function sortQuestionsByReceiverRole(questions: RecommendedQuestion[], receiverRole?: FamilyMemberRole) {
  const keyword = receiverRole === "mother" ? "엄마" : receiverRole === "father" ? "아빠" : "";
  if (!keyword) return questions;

  return [...questions].sort((a, b) => {
    const aScore = a.content.includes(keyword) ? 0 : 1;
    const bScore = b.content.includes(keyword) ? 0 : 1;
    return aScore - bScore || a.sortOrder - b.sortOrder;
  });
}

export async function getCurrentUserFamilyMembers(_currentUserId?: number | string) {
  void _currentUserId;
  const response = await apiFetch<unknown>("/v1/questions/recipients");
  return getArray(response, ["recipients", "members", "familyMembers", "family_members"])
    .map(normalizeReceiver)
    .filter((receiver) => receiver.userId);
}

export const getQuestionReceivers = getCurrentUserFamilyMembers;

export async function getQuestionThemes() {
  const depths: QuestionDepth[] = ["tiny", "medium", "deep"];
  const settled = await Promise.allSettled(
    depths.map((depth) => apiFetch<unknown>(`/v1/questions/recommendations?depth=${depth}&limit=30`)),
  );
  const categories = new Set<string>();

  settled.forEach((result) => {
    if (result.status !== "fulfilled") return;
    getArray(result.value, ["recommendations"]).forEach((item) => {
      const category = getString(asRecord(item), ["category"]);
      if (category) categories.add(category);
    });
  });

  const themes = Array.from(categories).map(normalizeTheme).sort((a, b) => a.sortOrder - b.sortOrder);
  return themes.length > 0 ? themes : FALLBACK_THEMES;
}

export async function getQuestionRecommendations(category: string, receiverRole?: FamilyMemberRole, limit = 3) {
  const depth = getDepthByCategory(category);
  const params = new URLSearchParams({
    depth,
    category,
    limit: String(Math.max(limit, 10)),
  });
  const response = await apiFetch<unknown>(`/v1/questions/recommendations?${params.toString()}`);
  const questions = getArray(response, ["recommendations"])
    .map(normalizeRecommendedQuestion)
    .filter((question) => !question.category || question.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return sortQuestionsByReceiverRole(questions, receiverRole).slice(0, limit);
}

export function getRecommendedQuestions(theme: QuestionTheme, limit = 3, receiverRole?: FamilyMemberRole) {
  return getQuestionRecommendations(theme.category, receiverRole, limit);
}

export async function sendQuestion(input: SendQuestionPayload) {
  const isRecommendation = input.source === "recommendation" && input.recommendationId != null;
  const body = isRecommendation
    ? {
        recipientUserId: input.recipientUserId,
        recommendationId: input.recommendationId,
      }
    : {
        recipientUserId: input.recipientUserId,
        depth: input.depth,
        questionText: input.questionText,
      };

  const response = await apiFetch<unknown>("/v1/questions", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return normalizeCreateQuestionResponse(response);
}

export function createQuestion(input: CreateQuestionRequest) {
  return sendQuestion({
    recipientUserId: input.recipientUserId,
    depth: input.depth,
    questionText: input.questionText,
    source: input.sourceType,
    recommendationId: input.recommendationId ?? null,
  });
}
