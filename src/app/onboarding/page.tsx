"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Card } from "@/components/ui";
import { OnboardingInfoCard } from "@/components/onboarding/OnboardingInfoCard";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

const cuts = [
  { title: "처음 물어본 날", duration: "00:42", image: "/mom.png" },
  { title: "요즘의 고민", duration: "00:42", image: "/son.png" },
  { title: "젊은 시절 꿈", duration: "00:42", image: "/grandfather.png" },
  { title: "남기고 싶은 말", duration: "00:42", image: "/daughter.png" },
];

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    const loginRedirectTimer = window.setTimeout(() => {
      router.replace("/login");
    }, 30000);

    return () => window.clearTimeout(loginRedirectTimer);
  }, [router]);

  return (
    <OnboardingShell
      eyebrow="살아있는 회고록"
      title={
        <>
          지금 묻지 않으면
          <br />
          남지 않을 이야기
        </>
      }
      description="부모와 자녀가 서로 묻고 답한 순간을 영상 회고록으로 남겨요."
      footer={
        <>
          <Button size="lg" fullWidth onClick={() => router.push("/login")}>
            시작하기
          </Button>
          <p className="text-caption" style={{ margin: 0, textAlign: "center", color: "var(--text-3)" }}>
            카카오 로그인으로 30초 안에 시작
          </p>
        </>
      }
      contentJustify="flex-start"
      contentPadding="var(--space-lg) 0 var(--space-xl)"
    >
      <Card variant="feature" elevation="card" padding="var(--space-lg)">
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "18px",
            fontWeight: "var(--weight-bold)",
            lineHeight: 1.4,
            color: "var(--text-1)",
          }}
        >
          오늘의 가족 기록
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "var(--space-sm)",
            marginTop: "var(--space-md)",
          }}
        >
          {cuts.map((cut) => (
            <div
              key={cut.title}
              className="relative overflow-hidden"
              style={{
                aspectRatio: "1 / 1",
                borderRadius: "var(--radius-xl)",
                background: "var(--color-ink-900)",
                backgroundImage: `url(${cut.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(20,18,14,0.65), rgba(20,18,14,0) 55%)" }}
              />
              <div
                aria-hidden="true"
                className="absolute flex items-center justify-center"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "34px",
                  height: "34px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--primary)",
                  color: "#fff",
                }}
              >
                <Play size={16} fill="currentColor" strokeWidth={0} />
              </div>
              <div className="absolute text-center" style={{ left: "8px", right: "8px", bottom: "10px" }}>
                <p
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: "var(--weight-semibold)",
                    lineHeight: 1.35,
                    color: "#fff",
                  }}
                >
                  {cut.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    fontWeight: "var(--weight-medium)",
                    lineHeight: 1.35,
                    color: "var(--color-ink-200)",
                  }}
                >
                  {cut.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <OnboardingInfoCard
        title="질문마다 한 컷의 영상"
        description="AI가 답변을 요약하고, 명대사를 뽑아 가족 다이어리로 정리합니다."
        bg="var(--color-coral-50)"
        style={{ border: "1px solid var(--color-coral-100)" }}
      />
    </OnboardingShell>
  );
}
