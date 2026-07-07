"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

type Role = "child" | "father" | "mother";

interface RoleOption {
  role: Role;
  title: string;
  description: string;
  imageSrc: string;
  imageName: string;
}

const roleOptions: RoleOption[] = [
  {
    role: "child",
    title: "자녀로 시작",
    description: "부모님께 질문을 보내고\n부모님의 답변을 받을 수 있어요.",
    imageSrc: "/children.png",
    imageName: "자녀",
  },
  {
    role: "father",
    title: "아버지로 시작",
    description: "자녀에게 질문을 보내거나,\n받은 질문에 영상으로 답변할 수 있어요.",
    imageSrc: "/father.png",
    imageName: "아버지",
  },
  {
    role: "mother",
    title: "어머니로 시작",
    description: "자녀에게 질문을 보내거나,\n받은 질문에 영상으로 답변할 수 있어요.",
    imageSrc: "/mother.png",
    imageName: "어머니",
  },
];

export default function RolePage() {
  const [selectedRole, setSelectedRole] = useState<Role>("child");

  const handleComplete = () => {
    // TODO: PATCH /api/v1/users/me/role API와 연결해 선택한 역할을 저장한다.
    console.log("[RolePage] selected role:", selectedRole);
  };

  return (
    <OnboardingShell
      eyebrow="처음 설정"
      title={
        <>
          어떤 역할로
          <br />
          시작할까요?
        </>
      }
      description={
        <>
          역할은 추천 질문과 홈 문구를 맞추기 위한 설정입니다.
          <br />
          부모와 자녀 모두 질문하고 답변할 수 있습니다.
        </>
      }
      contentJustify="flex-start"
      contentPadding="var(--space-xxl) 0 var(--space-xl)"
      style={{
        maxWidth: "430px",
        padding: "var(--space-xxxl) var(--page-padding-mobile) max(var(--space-lg), env(safe-area-inset-bottom))",
      }}
      footer={
        <Button size="lg" fullWidth onClick={handleComplete}>
          선택 완료
        </Button>
      }
    >
      <div role="radiogroup" aria-label="역할 선택" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {roleOptions.map((option) => (
          <RoleCard
            key={option.role}
            option={option}
            selected={selectedRole === option.role}
            onSelect={() => setSelectedRole(option.role)}
          />
        ))}
      </div>
    </OnboardingShell>
  );
}

function RoleCard({
  option,
  selected,
  onSelect,
}: {
  option: RoleOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelect();
  };

  return (
    <Card
      variant="base"
      elevation="subtle"
      padding="var(--space-md)"
      bg={selected ? "var(--color-sage-50)" : "var(--color-cream-100)"}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      style={{
        minHeight: "116px",
        border: selected ? "1.5px solid var(--color-sage-300)" : "1px solid var(--hairline-soft)",
        borderRadius: "var(--radius-xl)",
        outline: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar src={option.imageSrc} name={option.imageName} size="xl" />

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "17px",
                fontWeight: "var(--weight-bold)",
                lineHeight: 1.45,
                color: "var(--text-1)",
              }}
            >
              {option.title}
            </p>
            {selected && (
              <Badge variant="success" size="sm" style={{ flexShrink: 0, marginTop: "2px" }}>
                선택됨
              </Badge>
            )}
          </div>

          <p
            className="text-caption"
            style={{
              margin: "6px 0 0",
              color: "var(--text-2)",
              lineHeight: 1.45,
              whiteSpace: "pre-line",
            }}
          >
            {option.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
