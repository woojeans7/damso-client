# 라우트 맵

`AGENTS.md`의 담소 제품 플로우 10단계를 기준으로 정리한 프론트 라우트 계획. 하단 내비게이션(`BottomNav`) 4개 탭 — 홈 / 질문&답변 / 다이어리 / 설정 — 을 최상위 기준으로 삼는다.

| # | 플로우 단계 | 라우트 | 연동 API | 상태 |
| --- | --- | --- | --- | --- |
| 1 | 온보딩 | `/onboarding` | – | **구현됨** (`src/app/onboarding`). 브랜드 첫 화면, CTA 클릭 시 `/login` 이동 |
| 2 | 카카오 로그인 진입 | `/login` | `GET /api/v1/auth/kakao/login-url` | **구현됨** (`src/app/login`). 백엔드에서 받은 `loginUrl`로 이동 |
| 2 | 카카오 로그인 콜백 | `/auth/kakao/callback` | `POST /api/v1/auth/login-code/exchange` | **구현됨** (`src/app/auth/kakao/callback`). query의 `loginCode`를 Damso access token으로 교환 후 `localStorage(damso_access_token)` 저장, 이후 `/agreements` 이동 |
| 2 | 필수 동의 | `/agreements` | `GET /api/v1/users/me/agreements`, `POST /api/v1/users/me/agreements` | **구현됨** (`src/app/agreements`). 모든 필수 동의 체크 시 `/onboarding/role` 이동 |
| 3 | 역할 선택 (자식/엄마/아빠) | `/onboarding/role` | `PATCH /api/v1/users/me/role` | **구현됨** (`src/app/onboarding/role`). 역할 저장 후 홈으로 빠지지 않고 `/onboarding/family-connect` 이동 |
| 4 | 가족 연결 진입 | `/onboarding/family-connect` | `POST /api/v1/families`, `GET /api/v1/families/me/invitation` | **구현됨** (`src/app/onboarding/family-connect`). 가족 대표 초대 코드 화면으로 진입하며, 코드 직접 연결은 `/onboarding/family-code`로 이동. API 미준비/실패 시 401을 제외하고 목 초대 코드로 fallback |
| 4 | 가족 생성 · 초대 코드 공유 | `/onboarding/family-invite` (`/family/create` 별칭) | `POST /api/v1/families`, `GET /api/v1/families/me/invitation` | **구현됨** (`src/app/onboarding/family-invite`, `src/app/family/create`). 기존 초대 코드 조회 후 없으면 가족 생성, 복사/공유 fallback 제공. API 미준비/실패 시 401을 제외하고 목 초대 코드로 fallback |
| 4 | 초대 코드로 가족 합류 | `/onboarding/family-code` (`/family/join` 별칭) | `GET /api/v1/families/invitations/{invite_code}`, `POST /api/v1/families/join` | **구현됨** (`src/app/onboarding/family-code`, `src/app/family/join`). 6칸 직접 연결 코드 입력 후 `inviteCode`로 검증·합류 요청. API 미준비/실패 시 401을 제외하고 localStorage 목 가족 연결 상태를 저장한 뒤 홈으로 이동 |
| 5 | 홈 | `/` | `GET /api/v1/home/summary` | **구현됨** (`src/app/page.tsx`). 홈 상태 요약 조회 결과 `familyConnected=false`면 `/onboarding/family-connect`로 이동해 미연결 홈 화면을 노출하지 않음. API 미준비/실패 시 localStorage 목 연결 상태 기준으로 fallback |
| 5 | 질문 목록 확인 | `/questions` | `GET /api/v1/answers/questions?unansweredOnly=false&sort=unanswered_first` | **구현됨** (`src/app/questions`). 현재 사용자에게 온 질문 목록, 답변 상태, empty/loading/error 상태 표시 |
| 5 | 질문 상세 / 읽음 처리 | `/questions/[questionSendId]` | `GET /api/v1/answers/questions/{id}`, `PATCH /api/v1/answers/questions/{id}/read` | **구현됨** (`src/app/questions/[questionSendId]`). 받은 질문 상세, 답변 팁/프라이버시 카드, `/questions/[id]/record` 답변 CTA 연결 |
| 6 | 자녀가 질문 보내기 | `/questions/new` | `GET /api/v1/questions/recipients`, `GET /api/v1/questions/recommendations?depth=...&limit=3`, `POST /api/v1/questions` | **구현됨** (`src/app/questions/new`, `src/lib/api/questions.ts`). UI 테마 `일상/추억/고민`은 API `depth`(`tiny`/`medium`/`deep`)에 매핑 |
| 7 | 영상 답변 기록 | `/questions/[questionSendId]/record` | `POST /api/v1/answers/upload-url` → GCS PUT → `POST /api/v1/answers` | **구현됨** (`src/app/questions/[questionSendId]/record`). API 클라이언트는 `src/lib/api/answers.ts` |
| 8 | AI 처리 상태 (submitted→processing→completed/failed) | `/answers/[answerId]/processing` | `GET /api/v1/answers/{answer_id}/clip` (임시 폴링), 추후 Supabase Realtime `family:{family_id}` 채널 `answer_status_updated`로 교체 예정 | **구현됨** (`src/app/answers/[answerId]/processing`). F-07 제출 성공 시 이 라우트로 이동 |
| 9 | 네컷 그리드 (날짜+가족 단위) | `/diary` | `GET /api/v1/clips` | **구현됨** (`src/app/diary`). API 클라이언트는 `src/lib/api/clips.ts` |
| 10 | 컷 상세 (영상/명대사/요약) | `/diary/[answerId]` | `GET /api/v1/answers/{answer_id}/clip` | 미구현 |
| – | 설정 | `/settings` | 문서 확인 필요 | 미구현 |
| – | 카메라/마이크 권한 복구 안내 (F-15) | `/questions/[questionSendId]/record/permission` | – (`navigator.mediaDevices.getUserMedia`로 재요청) | **구현됨** (`src/app/questions/[questionSendId]/record/permission`). F-07에서 카메라 접근 실패 시 자동 이동, 성공하면 F-07로 복귀 |

## BottomNav ↔ 라우트 매핑

`src/components/ui/navigation/BottomNav.tsx`의 기본 탭 id는 아래 라우트에 대응한다.

| BottomNav id | 라벨 | 라우트 |
| --- | --- | --- |
| `home` | 홈 | `/` |
| `qna` | 질문&답변 | `/questions` |
| `diary` | 다이어리 | `/diary` |
| `settings` | 설정 | `/settings` |

## 확인 필요 항목

- 가족 생성/합류 화면의 최종 UX와 Figma 노드
- 가족 생성/합류 API의 최종 응답 필드명 — 현재 프론트는 `inviteCode`/`invite_code`/`code`, `familyName`/`family_name` 등 주요 alias를 허용하고, 합류 요청 body는 기존 프론트 관례에 맞춰 `{ inviteCode }`로 전송
- 목 가족 연결 fallback은 `src/lib/api/family-mock.ts`에서 관리하며 `damso_mock_family_connected=true`가 저장된 경우에만 홈 접근을 허용한다. 401은 fallback하지 않고 로그인으로 이동
- 카카오 로그인 코드 교환 응답의 최종 토큰 필드명 — 현재 프론트는 `accessToken`, `access_token`, `token`, `data.accessToken`, `data.access_token`을 허용하고 토큰이 없으면 실패 처리
- 질문 만들기 화면의 `일상`/`추억`/`고민` UI 테마는 현재 백엔드 스펙에 별도 theme API가 없어 `depth=tiny|medium|deep`으로 매핑한다. 백엔드에 theme 테이블/API가 생기면 `src/lib/api/questions.ts`의 `QUESTION_THEMES`를 API 조회로 교체 필요
- 로그인 토큰 저장 방식은 MVP 기준 `localStorage`의 `damso_access_token` 키를 사용 (`src/lib/auth/token.ts`). 추후 보안 정책 확정 시 httpOnly cookie 등으로 재검토 필요
- Supabase Realtime 채널 접속 정보(URL/키) — 나오기 전까지 `/answers/[answerId]/processing`은 `GET .../clip`을 2초 간격으로 폴링해서 완료를 감지함
- `GET /api/v1/answers/{answer_id}/clip`이 미완료 상태일 때 정확히 어떤 응답(404 등)을 주는지 미확인 — 현재는 "실패하면 아직 처리 중"으로 취급
- `GET /api/v1/clips` 응답에 `title`/`familyMemberRole`/`familyMemberName`/`questionCount` 필드가 실제로 포함되는지 미확인 (`src/lib/api/clips.ts`의 `DiaryEntry`에 옵셔널로 추정 반영). 그룹 헤더(월)와 "오늘/어제/N일 전" 상대 날짜 표기도 백엔드가 별도 그룹 구조를 주는지, 프론트가 `submittedAt` 하나로 직접 계산해야 하는지 확인 필요 — 현재는 후자로 구현
- F-15의 "← 뒤로가기"는 현재 임시로 `router.back()`만 호출함. 권한 복구 화면에서 명확히 질문 상세(`/questions/[questionSendId]`)로 돌아가야 하면 라우팅 조정 필요
- F-15의 "권한 허용 방법" 버튼은 목적지/콘텐츠 미정으로 아직 no-op 상태
