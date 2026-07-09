# Prompt Log

사용자가 지시한 프롬프트 기준으로 작업을 기록한다. 최신 항목이 위로 오도록 역순으로 쌓는다.

---

## 2026-07-10

- **프롬프트 요약**: 홈 화면 전체 규격은 유지하고 블록 스타일과 상태 색상만 시안 톤으로 수정
- **작업 구현 요약**: 홈(`/`)의 가족 연결 chip을 active 연결 상태 기반 초록/대기 베이지 톤으로 분리하고, 메인 카드의 답변 촬영 버튼을 코랄 CTA로 변경. 하단 정보 카드는 아이보리/베이지 배경과 코랄 dot, 갈색 텍스트 톤으로 정리하고, 다이어리 버튼 및 하단 네비게이션 active 텍스트 색상만 조정
- **변경점**: `src/app/page.tsx`, `src/lib/api/home.ts`, `src/lib/api/family-mock.ts`, `src/components/ui/navigation/BottomNav.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 홈 화면의 서로에게 남길 말 카드와 AI 정리 중 카드 색상/아이콘/배치 조정
- **작업 구현 요약**: 홈(`/`)의 “서로에게 남길 말” 카드에서 카메라 아이콘을 제거하고 연두색 배경으로 변경. “답변 촬영” 버튼은 아이콘 없이 작은 왼쪽 정렬 버튼으로 바꾸고, 시간 텍스트는 카드 오른쪽 하단에 배치. “AI 정리 중” 카드는 베이지색 배경과 amber 아이콘 톤으로 조정
- **변경점**: `src/app/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 홈 화면 CTA 버튼을 AI 정리 중 카드 바로 아래가 아닌 하단 네비게이션 위로 배치
- **작업 구현 요약**: 홈(`/`)의 `질문 만들기`/`다이어리 보기` 버튼 묶음을 본문 카드 영역에서 분리해 하단 footer 스택에 넣고, `BottomNav` 바로 위에 고정되도록 flex `mt-auto` 배치를 적용
- **변경점**: `src/app/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint` 통과

- **프롬프트 요약**: 홈 화면과 질문 만들기 화면을 첨부 시안 톤으로 수정하고 가족/질문 데이터를 DB 조회 기반으로 연결
- **작업 구현 요약**: 홈(`/`)을 “오늘 가족과 남길 기록” 화면으로 재구성해 연결 가족 chip, 받은 질문 최신 카드, 보낸 질문 요약, AI 정리 중 상태 카드, 질문 만들기/다이어리 CTA를 표시. 질문 만들기(`/questions/new`)는 연결 가족만 받는 사람으로 보여주고, 추천 질문 category 기반 테마와 선택 가족 role 우선 추천 정렬, 직접 질문 입력, 질문 전송 후 홈 이동을 연결. 하단 네비게이션은 pill 형태와 active 상태를 시안 톤에 맞춰 조정
- **변경점**: `src/app/page.tsx`, `src/app/questions/new/page.tsx`, `src/components/ui/navigation/BottomNav.tsx`, `src/lib/api/home.ts`, `src/lib/api/questions.ts`, `src/lib/api/family-mock.ts`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과. 개발 서버 `http://localhost:3000` 실행

---

## 2026-07-09

- **프롬프트 요약**: 가족 미연결 사용자는 홈 화면에 진입하지 못하게 하고, 가족 연결 완료를 목데이터로 확인할 수 있게 수정
- **작업 구현 요약**: 홈(`/`)에서 `GET /api/v1/home/summary`의 `familyConnected=false` 결과를 받으면 `/onboarding/family-connect`로 즉시 이동하도록 게이트를 추가하고, 미연결 홈 문구를 제거. 가족 초대/검증/합류 API는 실제 API를 먼저 호출하되 401을 제외한 실패 상황에서는 목 초대 코드와 localStorage 기반 목 가족 연결 상태로 fallback하도록 연결. 직접 코드 연결 성공 시 목 연결 상태를 저장해 홈 화면 확인이 가능하도록 구현
- **변경점**: `src/app/page.tsx`, `src/lib/api/families.ts`, `src/lib/api/home.ts`, `src/lib/api/family-mock.ts`, `docs/route-map.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 역할 선택 후 홈으로 이동하지 않고 가족 초대/연결 화면으로 이동하도록 수정
- **작업 구현 요약**: `/onboarding/role`에서 역할 저장 후 조회한 온보딩 상태의 `onboardingCompleted` 값으로 홈 이동을 판단하던 분기를 제거. 이미 가족이 연결된 사용자만 홈으로 보내고, 가족 미연결 상태는 항상 `/onboarding/family-connect`로 이동하도록 조정
- **변경점**: `src/app/onboarding/role/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 질문&답변 탭의 받은 질문 목록 → 상세 → 답변하기 플로우 구현
- **작업 구현 요약**: 하단 탭의 `질문&답변` 이동 기준을 `/questions` 목록으로 맞추고, 받은 질문 목록/상세 화면을 API 기반으로 구현. 목록은 현재 사용자에게 온 질문을 상태와 함께 표시하고, 상세는 sender 관계/이름과 질문 내용을 보여준 뒤 기존 영상 답변 라우트로 연결. 상세 진입 시 읽음 처리 API를 호출하고 loading/empty/error 상태를 추가
- **변경점**: `src/lib/api/answers.ts`, `src/app/questions/page.tsx`, `src/app/questions/[questionSendId]/page.tsx`, `src/app/questions/new/page.tsx`, `src/app/diary/page.tsx`, `src/app/questions/[questionSendId]/record/page.tsx`, `src/app/questions/[questionSendId]/record/permission/page.tsx`, `src/app/answers/[answerId]/processing/page.tsx`, `docs/route-map.md`, `docs/skills/family-question-flow.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 공유된 Question/Home API 스펙 기준으로 질문 만들기 API 연결 수정
- **작업 구현 요약**: 질문 API 클라이언트를 실제 스펙에 맞춰 `/questions/recipients`, `recommendations?depth&limit`, `POST /questions` 요청 구조로 변경. UI 테마 `일상/추억/고민`은 백엔드 `depth` enum에 매핑하고, 홈 화면은 `/home/summary`를 조회해 받은 질문/오늘 완료/최근 보낸 질문 상태를 표시하도록 연결
- **변경점**: `src/lib/api/questions.ts`, `src/lib/api/home.ts`, `src/app/questions/new/page.tsx`, `src/app/page.tsx`, `docs/route-map.md`, `docs/skills/family-question-flow.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 홈 → 가족 질문 만들기 플로우 UI와 API 연결 구현
- **작업 구현 요약**: 홈 화면을 담소 모바일 앱형 화면으로 교체하고 “질문 만들기” CTA를 `/questions/new`로 연결. 질문 만들기 화면에서 연결 가족 조회, 질문 테마 조회 및 fallback, 선택된 받는 사람/테마 기반 추천 질문 조회, 추천/직접 질문 상호 배타 상태, 질문 전송 API 호출과 성공/실패 UI를 구현
- **변경점**: `src/app/page.tsx`, `src/app/questions/new/page.tsx`, `src/lib/api/questions.ts`, `docs/route-map.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 가족 질문 만들기 플로우 구현 전 기준 스킬파일 작성
- **작업 구현 요약**: 가족 연결 이후 홈에서 질문 만들기 화면으로 진입해 연결된 가족에게 질문을 보내는 기능의 사용자 흐름, 화면 구성 기준, DB/API 연결 기준, 상태 관리, 예외 처리, 구현 주의사항을 문서화
- **변경점**: `docs/skills/family-question-flow.md` 추가, `PROMPT_LOG.md` 수정
- **검증 결과**: 문서 변경만 수행해 별도 빌드/테스트는 실행하지 않음

- **프롬프트 요약**: 가족 연결 2개 화면의 하단 블록을 웹앱 viewport 맨밑 기준으로 정렬
- **작업 구현 요약**: 기존 약관/역할 선택 화면의 `OnboardingShell` 레이아웃과 비교해, 가족 초대/직접 연결 화면의 공통 `PhoneCard`와 wrapper/form에 flex 높이 전파를 추가하고 footer에 `marginTop: auto`를 적용. 화면 콘텐츠가 짧을 때 마지막 CTA/안내 블록이 모바일 웹앱 viewport 하단에 붙도록 정리
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/components/onboarding/FamilyCodeScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `family-code`와 `family-invite-code` 화면의 UI 스케일 차이만 최소 수정
- **작업 구현 요약**: 두 화면의 최상위 wrapper가 같은 `FamilyOnboardingFrame`/`PhoneCard`를 공유하는 것을 기준으로, 피그마 목업용 단계 라벨과 외곽 카드 스타일을 제거해 실제 웹앱 단일 컬럼 기준으로 크기와 여백을 맞춤. 가족 연결 badge는 고정 폭/nowrap/flex 정렬을 유지하고, 기능 로직과 라우팅, `/onboarding/role`은 변경하지 않음
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/components/onboarding/FamilyCodeScreen.tsx`, `src/components/ui/actions/Button.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

---

## 2026-07-09

- **프롬프트 요약**: 가족 초대 코드 화면과 직접 연결 화면의 화면 규격을 `/onboarding/role` 기준으로 정렬
- **작업 구현 요약**: 가족 초대/가족 직접 연결 화면의 외곽 컨테이너를 역할 선택 화면과 같은 430px 모바일 컬럼, canvas 배경, 상하 safe-area 패딩으로 통일. 두 화면이 같은 프레임 컴포넌트를 재사용하도록 정리하고 기존 초대 코드 조회/공유, 직접 코드 검증/합류 기능은 유지
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/components/onboarding/FamilyCodeScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

---

## 2026-07-09

- **프롬프트 요약**: 가족 연결 코드 랜덤 생성 여부 확인 및 직접 연결 마지막 CTA 색상 정정
- **작업 구현 요약**: 가족 초대 화면의 고정 fallback 연결 코드(`A7K-28Q`)를 화면 진입 시 생성되는 6자리 랜덤 코드로 변경. 백엔드 초대 코드 응답이 오면 기존처럼 API 값을 우선 표시하고, 직접 연결 화면의 `연결하기` 버튼은 역할 선택 화면의 `선택 완료`와 같은 공용 `Button` 기본 primary 스타일로 맞춤
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/components/onboarding/FamilyCodeScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

---

## 2026-07-09

- **프롬프트 요약**: 직접 연결 화면의 코드 입력 블록, 연결하기 버튼, 가족 연결 말풍선 크기 최소 수정
- **작업 구현 요약**: `/onboarding/family-code`의 연결 코드 입력 블록을 하단 안내 블록과 같은 베이지 배경으로 맞추고, 마지막 `연결하기` CTA를 공용 `Button`의 danger variant로 변경. 자녀/부모 사이 연결 말풍선은 이전 카카오톡 연결 화면과 같은 고정 폭으로 유지되도록 flex basis를 명시
- **변경점**: `src/components/onboarding/FamilyCodeScreen.tsx`, `src/components/onboarding/FamilyInviteScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

---

## 2026-07-09

- **프롬프트 요약**: 가족 연결 온보딩의 직접 연결 말풍선 폭과 한글 문구 최소 수정
- **작업 구현 요약**: 공통 가족 연결 패널의 가운데 연결 라벨에 고정 폭을 적용해 `카카오톡 연결`/`직접 연결` 전환 시 폭이 흔들리지 않게 하고, 직접 연결 화면 문구를 지정 문안으로 정리. React inline style 경고를 막기 위해 공용 `Button` secondary 상태 스타일의 `borderColor`를 `border`로 통일
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/components/onboarding/FamilyCodeScreen.tsx`, `src/components/ui/actions/Button.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 직접 연결 코드 입력 블록과 가족 연결 화면의 “코드로 연결하기” 버튼 색상 정정
- **작업 구현 요약**: `/onboarding/family-code`의 연결 코드 입력 패널을 기존 주요 강조색인 coral 계열 블록으로 변경하고, `/onboarding/family-connect`/`/onboarding/family-invite`에서 쓰는 “코드로 연결하기” 버튼은 공용 `Button`을 유지한 채 cream 계열 베이지 배경과 테두리로 조정
- **변경점**: `src/components/onboarding/FamilyCodeScreen.tsx`, `src/components/onboarding/FamilyInviteScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 가족 초대 화면의 코드/안내 블록 배경과 카카오 초대 버튼 색상 정정
- **작업 구현 요약**: `/onboarding/family-connect`/`/onboarding/family-invite`에서 쓰는 가족 초대 화면의 연결 코드 블록과 “카카오톡 초대 보내기” 안내 블록을 직접 연결 화면과 같은 베이지 배경(`--color-cream-100`)으로 맞춤. 카카오 초대 CTA는 기존 공용 `Button`을 유지하면서 카카오톡 브랜드 색상 토큰을 추가해 노란색 배경으로 조정
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/styles/tokens/colors.css`, `docs/design-system.md`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 직접 연결 코드 입력 화면의 코드 입력/안내 블록 배경색 정정
- **작업 구현 요약**: `/onboarding/family-code`의 연결 코드 입력 블록과 하단 안내 블록 배경을 `/onboarding/role` 역할 카드의 베이지 톤과 같은 `--color-cream-100` 토큰으로 맞춤. 공유 `InfoBox`는 기본 배경을 유지하되 화면별로 배경 토큰을 넘길 수 있게 확장
- **변경점**: `src/components/onboarding/FamilyCodeScreen.tsx`, `src/components/onboarding/FamilyInviteScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/onboarding/role` 이후 홈으로 이동하지 않고 가족 연결/초대 온보딩으로 이어지도록 점검 및 수정
- **작업 구현 요약**: App Router 구조와 기존 가족 초대/직접 연결 화면 구현을 확인하고, 역할 저장 성공 후 이동 경로를 `/onboarding/family-connect`로 통일. 기존 초대 화면을 재사용하는 `/onboarding/family-connect` 라우트를 추가하고, 초대 화면 문구를 요청한 “가족 대표와 연결하세요” 흐름에 맞췄으며 “코드로 연결하기” 버튼은 온보딩 직접 연결 라우트(`/onboarding/family-code`)로 이동하도록 정리
- **변경점**: `src/app/onboarding/role/page.tsx`, `src/app/onboarding/family-connect/page.tsx`, `src/components/onboarding/FamilyInviteScreen.tsx`, `docs/route-map.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/onboarding/role` 역할 선택 후 가족 초대 온보딩 화면으로 연결
- **작업 구현 요약**: 역할 저장 후 `GET /api/v1/users/me/onboarding` 결과가 가족 미연결 상태이면 기존 `/family/create` 대신 `/onboarding/family-invite`로 이동하도록 수정. 라우트맵도 `/onboarding/family-invite`를 기준 경로, `/family/create`를 별칭으로 정리
- **변경점**: `src/app/onboarding/role/page.tsx`, `docs/route-map.md`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 가족 초대/가족 연결 2개 화면을 레퍼런스 방향에 맞춰 정리
- **작업 구현 요약**: 카카오톡 초대 화면을 단계 라벨, 휴대폰 카드 status bar, children/father 관계 박스, 연결 코드, 안내 박스, 2버튼 footer 구조로 재구성. 직접 연결 화면은 children/mother 관계 박스와 6칸 코드 입력 UI를 추가하고, 영문 대문자/숫자 제한·자동 포커스 이동·Backspace 이전 이동·하이픈 포함 코드 조합 후 기존 가족 검증/합류 API에 연결
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/components/onboarding/FamilyCodeScreen.tsx`, `src/app/family/join/page.tsx`, `src/app/onboarding/family-code/page.tsx`, `docs/route-map.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

## 2026-07-08

- **프롬프트 요약**: `/onboarding/family-invite`의 Figma 03 카카오톡 연결 · 가족 초대 화면과 불일치한 UI 정정
- **작업 구현 요약**: 모바일 앱 단일 컬럼 흐름을 유지하면서 상단 문구, 가족 연결 민트 카드, 낮은 연결 코드 카드, 카카오톡 초대 안내 카드, 가로 2버튼 footer 순서가 Figma 목표 구조와 맞도록 세부 여백·버튼·카드 표현을 재조정. 공유 취소는 오류 메시지로 노출하지 않도록 취소 판정을 보강하고, inviteCode 조회/가족 생성 API 흐름은 유지
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/onboarding/family-invite` 화면을 Figma 03 카카오톡 연결 · 가족 초대 화면 기준으로 정정
- **작업 구현 요약**: 기존의 큰 초대 코드 복사 카드 중심 UI를 가족 연결 카드, 낮은 연결 코드 카드, 카카오톡 초대 안내 카드, 가로 2버튼 footer 구조로 재구성. `public/children.png`, `public/father.png`를 원형 아바타로 표시하고, 기존 `getMyFamilyInvitation`/`createFamily` 초대 코드 조회·생성 로직과 Web Share/clipboard fallback은 유지하되 공유 취소는 오류 메시지로 노출하지 않도록 처리
- **변경점**: `src/components/onboarding/FamilyInviteScreen.tsx`, `src/app/onboarding/family-invite/page.tsx` 추가, `src/app/family/create/page.tsx`를 동일 화면 재사용으로 교체, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/family/create` 접속 시 Not Found 발생 수정
- **작업 구현 요약**: 라우트맵에서 계획되어 있었지만 미구현이던 가족 생성/초대 화면(`/family/create`)과 초대 코드 합류 화면(`/family/join`)을 추가. 가족 API 클라이언트(`POST /api/v1/families`, `GET /api/v1/families/me/invitation`, `GET /api/v1/families/invitations/{invite_code}`, `POST /api/v1/families/join`)를 추가하고, 초대 코드 표시/복사/공유 fallback/코드 검증/합류 요청/401 로그인 이동을 연결
- **변경점**: `src/lib/api/families.ts`, `src/app/family/create/page.tsx`, `src/app/family/join/page.tsx` 추가, `docs/route-map.md`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/onboarding/role` 선택 완료 시 역할 저장 API 연동
- **작업 구현 요약**: OpenAPI 기준 `PATCH /api/v1/users/me/role` 클라이언트를 추가하고, 역할 선택 CTA에서 선택한 `child`/`mother`/`father` 값을 저장하도록 연결. 저장 중 로딩/비활성화 상태와 401/422 오류 메시지를 추가하고, 성공 후 `GET /api/v1/users/me/onboarding` 결과에 따라 가족 연결 완료 시 `/`, 미완료 시 `/family/create`로 이동
- **변경점**: `src/lib/api/users.ts`, `src/app/onboarding/role/page.tsx`, `docs/route-map.md`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: 로그인 후 `/onboarding/role` 역할 선택 화면 구현
- **작업 구현 요약**: 약관 동의 이후 이동하는 역할 선택 라우트를 추가하고, 자녀/아버지/어머니 카드 3개와 기본 `child` 선택 상태를 구현. 선택된 카드만 세이지 배경과 `선택됨` pill로 표시되며 CTA는 현재 role 값을 콘솔에 출력하고 추후 역할 저장 API 연동 TODO를 남김
- **변경점**: `src/app/onboarding/role/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: API client 에러 처리 개선 및 `/login` 카카오 로그인 URL 요청 실패 디버깅 강화
- **작업 구현 요약**: 공통 API 에러에 request URL/status/response body/detail을 보존하고 실패 시 콘솔에 출력하도록 개선. `NEXT_PUBLIC_API_BASE_URL` 누락 시 명확히 실패하며 trailing slash/path slash 조합을 안전하게 처리. 로그인 화면은 카카오 로그인 URL 요청 실패 시 중복 클릭을 막고, JSON `detail` 우선 정책과 500 일반 메시지 정책에 따라 사용자용 에러를 표시
- **변경점**: `src/lib/api/client.ts`, `src/lib/api/auth.ts`, `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/agreements` 화면에 Swagger 기준 동의 상태 조회/저장 API 연동
- **작업 구현 요약**: 사용자 동의 타입과 API 함수(`GET/POST /api/v1/users/me/agreements`)를 추가하고, 페이지 진입 시 `damso_access_token`으로 기존 동의 상태를 조회해 체크박스를 초기화. 누락 항목은 미동의로 처리하며, 4개 모두 체크 시 저장 요청 후 `/onboarding/role`로 이동. 401은 토큰 제거 후 `/login` 이동, 400/기타 오류 메시지 표시
- **변경점**: `src/lib/api/users.ts` 추가, `src/app/agreements/page.tsx`, `src/components/onboarding/AgreementCheckbox.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/agreements` 화면을 최신 Figma 기준 약관 동의 UI로 수정
- **작업 구현 요약**: 상단 문구를 개인정보 약관 동의 흐름으로 교체하고, 4개 필수 동의 카드/오른쪽 약관 pill/코랄 체크박스 상태를 반영. 첫 3개 항목은 기본 체크, 데이터 활용 항목은 기본 미체크로 설정하고, 안내 카드와 하단 CTA/문구를 추가. API 연동 없이 CTA와 약관 pill은 TODO 로그만 남김
- **변경점**: `src/app/agreements/page.tsx`, `src/components/onboarding/AgreementCheckbox.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `.env` 확인 후 환경변수 기준에 맞춰 필요한 코드 수정
- **작업 구현 요약**: `.env`와 `.env.example`의 `NEXT_PUBLIC_API_BASE_URL` 키가 배포 백엔드와 일치하는지 확인하고, `next.config.ts`의 예전 `NEXT_PUBLIC_API_URL`/localhost fallback을 제거해 새 API base URL이 없으면 명확히 실패하도록 정리
- **변경점**: `next.config.ts`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: Damso 프론트엔드에 백엔드 기반 카카오 로그인 연동 구현
- **작업 구현 요약**: `/login`의 임시 `/agreements` 이동을 제거하고 백엔드 `loginUrl` 발급 API 호출 후 카카오 OAuth로 이동하도록 연결. `/auth/kakao/callback`에서 query의 `loginCode`를 Damso access token으로 교환해 `localStorage(damso_access_token)`에 저장 후 `/agreements`로 이동. 토큰 유틸과 auth API 클라이언트 추가, 새 API base URL env 문서화
- **변경점**: `.env.example`, `next.config.ts`, `src/app/login/page.tsx`, `src/app/auth/kakao/callback/page.tsx`, `src/app/auth/kakao/callback/CallbackClient.tsx`, `src/lib/api/auth.ts`, `src/lib/api/client.ts`, `src/lib/auth/token.ts`, `docs/route-map.md`, `PROMPT_LOG.md` 수정/추가
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/login` 카드의 두 제공 이미지 렌더 높이 통일
- **작업 구현 요약**: 투명 PNG 원본 비율 표시를 유지하되, 아바타 표시 기준을 폭 93px에서 높이 93px로 변경해 두 이미지의 렌더 높이가 같게 조정
- **변경점**: `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/login` 카드의 제공 이미지 하얀 테두리 제거 및 이미지 크기 1.5배 확대
- **작업 구현 요약**: `children`/`father`/`mother` PNG의 외곽 단색 배경을 투명 처리하고, 로그인 카드 아바타 렌더링을 고정 원형 크롭에서 투명 PNG 원본 비율 표시로 변경. 표시 폭은 기존 62px에서 93px로 확대하고 카드 높이/위치를 조정
- **변경점**: `public/children.png`, `public/father.png`, `public/mother.png`, `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/login` 카카오 연결 카드부터 안내 카드 2개까지 아래로 내리고 아바타 이미지 겹침/테두리 제거
- **작업 구현 요약**: 온보딩 콘텐츠 상단 여백을 늘려 카카오 연결 카드와 하단 안내 카드 묶음을 아래로 이동. 카드 내 실제 이미지 2개의 음수 마진과 흰색 테두리를 제거하고 토큰 기반 간격을 추가
- **변경점**: `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/login` 카카오 연결 카드의 CSS placeholder 아바타를 public 실제 이미지로 교체
- **작업 구현 요약**: `public/children.png`, `public/father.png` 실제 파일명을 확인하고 `next/image`로 원형 아바타 2개를 카드 오른쪽 하단에 겹쳐 배치. 안내 카드 2개와 `/agreements` CTA 이동은 유지
- **변경점**: `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

- **프롬프트 요약**: `/login` 화면을 Figma 기준 "01 가입 · 카카오 로그인" 구조로 정정
- **작업 구현 요약**: 상단 문구를 간편 가입 기준으로 바꾸고, 민트 톤 카카오 연결 메인 카드에 여성/남성 CSS 캐릭터 아바타 2개를 배치. 안내 카드는 코랄 dot이 있는 2개 카드로 정리하고 CTA는 `/agreements` 임시 이동을 유지
- **변경점**: `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

## 2026-07-07

- **프롬프트 요약**: `/login` 화면을 모바일 앱형 카카오 로그인 목표 디자인으로 수정
- **작업 구현 요약**: 로그인 헤더/메인 카카오 카드/하단 CTA 문구와 여백을 목표 화면 기준으로 조정하고 모바일 최대 폭 컨테이너를 적용
- **변경점**: `src/app/login/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

## 2026-07-07

- **프롬프트 요약**: `/onboarding` 상단 DAMSO 문구를 교체하고 30초 후 `/login`으로 자동 이동하도록 수정
- **작업 구현 요약**: 온보딩 eyebrow를 `살아있는 회고록`으로 설정하고, 페이지 진입 후 30초 타이머로 로그인 화면에 `replace` 이동하는 클라이언트 효과 추가
- **변경점**: `src/app/onboarding/page.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint`, `npm run build` 통과

## 2026-07-07

- **프롬프트 요약**: `/onboarding` 화면을 모바일 웹앱 기준 Figma 형태로 조정하고 오늘의 가족 기록을 영상 썸네일형 네컷 카드로 수정
- **작업 구현 요약**: 온보딩 본문을 헤더 바로 아래에서 시작하도록 배치하고, 2x2 CSS 영상 placeholder 그리드와 코랄 안내 카드, CTA 보조 문구를 반영
- **변경점**: `src/app/onboarding/page.tsx`, `src/components/onboarding/OnboardingShell.tsx`, `src/components/onboarding/OnboardingInfoCard.tsx`, `PROMPT_LOG.md` 수정
- **검증 결과**: `npm run lint` 통과. `npm run build`는 기본 샌드박스에서 Turbopack 포트 바인딩 권한 문제로 1차 실패 후, 권한 승인 실행으로 통과

## 2026-07-07

- **프롬프트 요약**: 온보딩 1차 화면 3개(`/onboarding`, `/login`, `/agreements`)를 API 연동 없이 Figma 톤 기준으로 구현
- **작업 구현 요약**: 브랜드 첫 화면, 카카오 로그인 안내 화면, 필수 동의 체크 화면 구현. 로그인/동의 저장은 실제 API 호출 없이 TODO stub으로 두고 임시 라우팅만 연결
- **변경점**: `src/app/onboarding/page.tsx`, `src/app/login/page.tsx`, `src/app/agreements/page.tsx`, `src/components/onboarding/OnboardingShell.tsx`, `src/components/onboarding/OnboardingInfoCard.tsx`, `src/components/onboarding/AgreementCheckbox.tsx` 추가, `docs/route-map.md` 갱신
- **검증 결과**: `npm run lint` 통과. `npm run build`는 기본 샌드박스에서 Turbopack 포트 바인딩 권한 문제로 1차 실패 후, 권한 승인 실행으로 통과

## 2026-07-07

- **프롬프트 요약**: F-15 권한 요청 안내 페이지 만들어줘 (뒤로가기는 F-06 미구현이라 TODO로 남김)
- **작업 구현 요약**: F-15 카메라/마이크 권한 복구 안내 화면 구현. "권한 다시 요청" 버튼은 실제 `getUserMedia`로 재요청해 성공 시 F-07로 복귀. F-07에서 카메라 접근 실패 시 이 화면으로 자동 이동하도록 연결
- **변경점**: `src/app/questions/[questionSendId]/record/permission/page.tsx` 추가, F-07의 `onUserMediaError`에서 이 라우트로 이동하도록 수정, `docs/route-map.md` 갱신

## 2026-07-07

- **프롬프트 요약**: 다음 화면 작업 시작하자 (F-09 다이어리 목록 선택)
- **작업 구현 요약**: F-09 다이어리 목록 화면 구현
- **변경점**: `src/app/diary/page.tsx`, `src/lib/api/clips.ts` 추가, `docs/route-map.md` 갱신

## 2026-07-07

- **프롬프트 요약**: F08 진행해줘
- **작업 구현 요약**: F-08 AI 처리 상태 화면 구현, F-07 제출 성공 시 이 화면으로 이동하도록 연결
- **변경점**: `src/app/answers/[answerId]/processing/page.tsx` 추가, `src/lib/api/answers.ts`에 `getAnswerClip` 추가, `docs/route-map.md` 갱신

## 2026-07-07

- **프롬프트 요약**: (Answer API 문서 공유 후) 진행해줘
- **작업 구현 요약**: 답변 업로드 API(업로드 URL 발급 → GCS 업로드 → 메타데이터 제출) 실연동, `/record`를 `/questions/[questionSendId]/record`로 이동
- **변경점**: `src/lib/api/client.ts`, `src/lib/api/answers.ts` 추가, `next.config.ts` rewrite 경로 수정, `src/app/record` → `src/app/questions/[questionSendId]/record` 이동

## 2026-07-07

- **프롬프트 요약**: Notion DB 스키마 / Answer API 내용을 docs에 정리하고 개발하면서 참조하게 해줘
- **작업 구현 요약**: 공유받은 내용을 프로젝트 문서로 정리
- **변경점**: `docs/backend-db-schema.md`, `docs/backend-answer-api.md`, `docs/route-map.md` 추가, `AGENTS.md`에 백엔드 연동 참고 섹션 추가

## 2026-07-07

- **프롬프트 요약**: 담소 전체 플로우 10단계 공유 + Figma F-07 노드 기준으로 구현해줘 (디자인 시스템 컴포넌트 사용 권장)
- **작업 구현 요약**: F-07 영상 답변 기록 화면 구현 (카메라 녹화 UI)
- **변경점**: `AGENTS.md`에 제품 플로우/UI 구현 원칙 추가, `src/app/record/page.tsx` 추가, `Button`에 `sage` variant 추가, `BottomNav` 컴포넌트 추가
