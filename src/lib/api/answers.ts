import { apiFetch } from "./client";
import type { QuestionDepth } from "./questions";
import type { UserRole } from "./users";

export type AnswerStatus = "submitted" | "processing" | "completed" | "failed";
export type QuestionStatus = "sent" | "answered" | "cancelled" | "expired";

export interface QuestionSender {
  userId: number;
  displayName: string;
  profileImageUrl: string | null;
  role: UserRole;
}

export interface ReceivedQuestion {
  questionSendId: number;
  sender: QuestionSender;
  questionText: string;
  depth: QuestionDepth;
  receivedAt: string;
  read: boolean;
  readAt: string | null;
  answered: boolean;
  answeredAt: string | null;
  status: QuestionStatus;
}

export interface ReceivedQuestionDetail extends ReceivedQuestion {
  source: "recommendation" | "custom";
  recommendationId: number | null;
}

export interface GetReceivedQuestionsOptions {
  unansweredOnly?: boolean;
  sort?: "latest" | "unanswered_first";
}

export interface MarkQuestionReadResponse {
  questionSendId: number;
  read: boolean;
  readAt: string;
}

type ApiRecord = Record<string, unknown>;

function asRecord(input: unknown): ApiRecord {
  return input && typeof input === "object" ? (input as ApiRecord) : {};
}

function getArray(input: unknown, key: string): unknown[] {
  const source = asRecord(input);
  const value = source[key];
  return Array.isArray(value) ? value : [];
}

function getString(source: ApiRecord, key: string) {
  const value = source[key];
  return typeof value === "string" ? value : "";
}

function getNullableString(source: ApiRecord, key: string) {
  const value = source[key];
  return typeof value === "string" ? value : null;
}

function getNumber(source: ApiRecord, key: string) {
  const value = source[key];
  return typeof value === "number" ? value : 0;
}

function getNullableNumber(source: ApiRecord, key: string) {
  const value = source[key];
  return typeof value === "number" ? value : null;
}

function getBoolean(source: ApiRecord, key: string) {
  const value = source[key];
  return typeof value === "boolean" ? value : false;
}

function normalizeRole(input: string): UserRole {
  if (input === "child" || input === "mother" || input === "father") return input;
  return "child";
}

function normalizeDepth(input: string): QuestionDepth {
  if (input === "tiny" || input === "medium" || input === "deep") return input;
  return "tiny";
}

function normalizeQuestionStatus(input: string): QuestionStatus {
  if (input === "sent" || input === "answered" || input === "cancelled" || input === "expired") return input;
  return "sent";
}

function normalizeSender(input: unknown): QuestionSender {
  const source = asRecord(input);

  return {
    userId: getNumber(source, "userId"),
    displayName: getString(source, "displayName"),
    profileImageUrl: getNullableString(source, "profileImageUrl"),
    role: normalizeRole(getString(source, "role")),
  };
}

function normalizeReceivedQuestion(input: unknown): ReceivedQuestion {
  const source = asRecord(input);

  return {
    questionSendId: getNumber(source, "questionSendId"),
    sender: normalizeSender(source.sender),
    questionText: getString(source, "questionText"),
    depth: normalizeDepth(getString(source, "depth")),
    receivedAt: getString(source, "receivedAt"),
    read: getBoolean(source, "read"),
    readAt: getNullableString(source, "readAt"),
    answered: getBoolean(source, "answered"),
    answeredAt: getNullableString(source, "answeredAt"),
    status: normalizeQuestionStatus(getString(source, "status")),
  };
}

function normalizeReceivedQuestionDetail(input: unknown): ReceivedQuestionDetail {
  const source = asRecord(input);
  const base = normalizeReceivedQuestion(input);
  const sourceType = getString(source, "source");

  return {
    ...base,
    source: sourceType === "recommendation" ? "recommendation" : "custom",
    recommendationId: getNullableNumber(source, "recommendationId"),
  };
}

export interface RequestAnswerUploadUrlInput {
  questionSendId: string;
  videoMimeType: string;
}

export interface RequestAnswerUploadUrlResult {
  uploadUrl: string;
  expiresAt: string;
}

/** POST /api/v1/answers/upload-url — GCS presigned PUT URL 발급 */
export function requestAnswerUploadUrl(input: RequestAnswerUploadUrlInput) {
  return apiFetch<RequestAnswerUploadUrlResult>("/v1/answers/upload-url", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** 발급받은 presigned URL로 영상을 GCS에 직접 업로드 (백엔드 경유 안 함) */
export async function uploadAnswerVideo(uploadUrl: string, video: Blob) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": video.type },
    body: video,
  });

  if (!res.ok) {
    throw new Error(`영상 업로드에 실패했어요 (${res.status})`);
  }
}

export interface SubmitAnswerInput {
  questionSendId: string;
  videoMimeType: string;
  videoDurationSeconds: number;
  videoSizeBytes: number;
}

export interface SubmitAnswerResult {
  answerId: string;
  questionSendId: string;
  status: AnswerStatus;
  submittedAt: string;
}

/** POST /api/v1/answers — 업로드 완료 후 메타데이터 제출, AI 처리 비동기 시작 */
export function submitAnswer(input: SubmitAnswerInput) {
  return apiFetch<SubmitAnswerResult>("/v1/answers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface AnswerClip {
  videoUrl: string;
  thumbnailUrl: string;
  transcript: string;
  transcriptSegments: unknown[];
  title: string;
  quote: string;
  oneLineSummary: string;
  emotionTags: string[];
  fourcutTitle: string;
}

/**
 * GET /api/v1/answers/{answer_id}/clip — status가 completed일 때만 데이터 존재.
 * 미완료 상태일 때의 정확한 응답 형태(404 등)는 아직 미확인 — docs/route-map.md 참고.
 */
export function getAnswerClip(answerId: string) {
  return apiFetch<AnswerClip>(`/v1/answers/${answerId}/clip`);
}

export async function getReceivedQuestions(options: GetReceivedQuestionsOptions = {}) {
  const params = new URLSearchParams({
    unansweredOnly: String(options.unansweredOnly ?? false),
    sort: options.sort ?? "unanswered_first",
  });
  const response = await apiFetch<unknown>(`/v1/answers/questions?${params.toString()}`);

  return getArray(response, "questions").map(normalizeReceivedQuestion);
}

export async function getReceivedQuestionDetail(questionSendId: string) {
  const response = await apiFetch<unknown>(`/v1/answers/questions/${encodeURIComponent(questionSendId)}`);

  return normalizeReceivedQuestionDetail(response);
}

export function markReceivedQuestionRead(questionSendId: string) {
  return apiFetch<MarkQuestionReadResponse>(`/v1/answers/questions/${encodeURIComponent(questionSendId)}/read`, {
    method: "PATCH",
  });
}
