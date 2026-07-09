import type { FamilyInvitation, FamilyInvitationValidation, JoinFamilyResponse } from "./families";
import type { HomeSummary } from "./home";

const MOCK_FAMILY_CONNECTED_KEY = "damso_mock_family_connected";
const MOCK_FAMILY_CODE_KEY = "damso_mock_family_code";

export const MOCK_FAMILY_INVITE_CODE = "DAM-SO1";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function isMockFamilyConnected() {
  if (!canUseStorage()) return false;

  return window.localStorage.getItem(MOCK_FAMILY_CONNECTED_KEY) === "true";
}

export function setMockFamilyConnected(inviteCode = MOCK_FAMILY_INVITE_CODE) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(MOCK_FAMILY_CONNECTED_KEY, "true");
  window.localStorage.setItem(MOCK_FAMILY_CODE_KEY, inviteCode);
}

export function getMockFamilyInvitation(): FamilyInvitation {
  return {
    familyId: 1,
    familyName: "담소 가족",
    inviteCode: MOCK_FAMILY_INVITE_CODE,
    inviteUrl: "/onboarding/family-code",
    shareText: `담소 가족 초대 코드: ${MOCK_FAMILY_INVITE_CODE}`,
    expiresAt: null,
  };
}

export function getMockFamilyInvitationValidation(inviteCode: string): FamilyInvitationValidation {
  return {
    familyId: 1,
    familyName: "담소 가족",
    inviteCode,
    available: inviteCode.replace("-", "").length >= 6,
    expiresAt: null,
  };
}

export function getMockJoinFamilyResponse(): JoinFamilyResponse {
  return {
    familyId: 1,
    familyName: "담소 가족",
    familyMemberId: 1,
    joinedAt: new Date().toISOString(),
  };
}

export function getMockHomeSummary(): HomeSummary {
  const familyConnected = isMockFamilyConnected();

  return {
    familyConnected,
    familyId: familyConnected ? 1 : null,
    role: "child",
    connectedToChild: true,
    connectedToParent: familyConnected,
    connectedMembers: familyConnected
      ? [
          {
            userId: 2,
            familyMemberId: 2,
            familyId: 1,
            displayName: "엄마",
            profileImageUrl: null,
            role: "mother",
            roleLabel: "엄마",
            active: true,
          },
        ]
      : [],
    todayCompletedCount: familyConnected ? 1 : 0,
    pendingReceivedQuestion: null,
    latestSentQuestion: familyConnected
      ? {
          questionSendId: 1,
          recipient: {
            userId: 2,
            displayName: "엄마",
            profileImageUrl: null,
            role: "mother",
          },
          questionText: "어릴 때 가장 기억에 남는 하루는 언제였나요?",
          depth: "medium",
          sentAt: new Date().toISOString(),
          read: true,
          readAt: new Date().toISOString(),
          answered: false,
          answeredAt: null,
          status: "sent",
          aiStatus: null,
        }
      : null,
    latestSentQuestions: [],
    aiStatus: null,
  };
}
