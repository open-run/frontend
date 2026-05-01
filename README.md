# 🏃 OpenRun Frontend

> 오픈런이란 다양한 사람들과 달리기 모임에 참여하고, NFT 아바타를 획득하여 나만의 개성을 표현할 수 있는 커뮤니티 기반 M2E dApp입니다.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Web3](https://img.shields.io/badge/Web3-wagmi_+_viem-7B3FE4)

<!-- TODO: 스크린샷 또는 데모 링크 삽입 -->

---

## 주요 기능

| 기능 | 설명 | 관련 디렉토리 |
|------|------|---------------|
| **벙 (러닝 모임)** | 러닝 모임 생성, 참여, 관리 | `components/bung/`, `app/(private)/bung/` |
| **챌린지** | 일반·반복·연속 챌린지 참여 및 진행 | `components/challenges/` |
| **NFT 보상** | 챌린지 완료 시 NFT 민팅 | `contexts/WalletProvider.tsx`, `apis/v1/nft/` |
| **아바타** | 3D 아바타 커스터마이징 및 캡쳐 | `components/avatar/`, `app/(private)/avatar/` |
| **지도 & 날씨** | Google Maps 위치 연동, 실시간 날씨 | `contexts/GoogleMapContext.tsx`, `app/api/weather/` |
| **챗봇** | RAG 기반 AI 챗봇 | `components/chat/`, `app/api/chat/` |
| **참여 인증** | GPS 기반 벙 참여 인증 (500m 이내) | `components/bung/modal/CertifyParticipationModal.tsx` |

---

## 기술 스택

| 카테고리 | 기술 |
|----------|------|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Web3** | wagmi 2, viem 2, Reown AppKit / WalletConnect |
| **State** | Zustand, @tanstack/react-query 5, nuqs (URL state) |
| **Styling** | Tailwind CSS 3, Framer Motion |
| **Maps** | @vis.gl/react-google-maps |
| **Forms** | react-hook-form |
| **UI** | Swiper, react-day-picker, html2canvas |
| **Search** | Fuse.js (client-side fuzzy search) |
| **Date** | date-fns, date-fns-tz |
| **Package Manager** | Yarn 4.0.2 |

---

## 시작하기

### 사전 요구사항

- **Node.js** 20+ (`.nvmrc` 참조)
- **Yarn 4** (`corepack`으로 활성화)

### 설치 및 실행

```bash
# 1. Yarn 4 활성화
corepack enable

# 2. 의존성 설치
yarn install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 실제 API 키를 입력하세요

# 4. 개발 서버 실행
yarn dev
```

### 챗봇 BFF 회귀 테스트

`/api/chat` 레벨에서 lane/kind/uiHints/권한 처리 회귀를 검사합니다.

```bash
# frontend dev 서버 실행 상태에서
yarn chat:smoke

# 반복 검사
python3 scripts/chat_bff_smoke.py --rounds 2
```

### 환경 변수

`.env.example`을 `.env`로 복사한 뒤 실제 값을 입력합니다.

#### Client-side (`NEXT_PUBLIC_*` — 브라우저에 노출됨)

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `NEXT_PUBLIC_API_SERVER_URL` | 백엔드 API 서버 URL | 팀 내부 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (지도 렌더링) | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Reown AppKit / WalletConnect | [Reown Cloud](https://cloud.reown.com/) |

#### Server-side (서버에서만 사용 — 브라우저에 노출되지 않음)

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `GOOGLE_API_KEY` | Google Maps / Geocoding / Places | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `OPENWEATHER_API_KEY` | 날씨 정보 | [OpenWeather](https://home.openweathermap.org/api_keys) |
| `BOT_SERVER_URL` | RAG 챗봇 서비스 | 팀 내부 |

### 정상 동작 확인

`http://localhost:3000` 접속 시 **`/signin` 페이지로 리다이렉트**됩니다. 이것이 정상입니다.

미들웨어(`src/middleware.ts`)가 인증 토큰이 없는 요청을 자동으로 로그인 페이지로 보냅니다.

---

## 프로젝트 구조

```
src/
├── apis/           # Axios 기반 API 클라이언트 (v1 RESTful, query/mutation 패턴)
├── app/            # Next.js App Router 페이지 및 API Route Handlers
│   ├── api/        #   └─ BFF 서버 프록시 (chat, geocoding, places, reverse-geocoding, weather)
│   ├── (private)/  #   └─ 인증 필요 라우트 (bung, profile, avatar, challenges)
│   └── signin/     #   └─ 로그인 페이지
├── components/     # 페이지별 컴포넌트 + shared/ (공용 29개) + icons/ (SVG 32개)
├── constants/      # 상수 정의 (modal keys, cookie keys, layout 등)
├── contexts/       # React Context (Modal, ReactQuery, Wallet, GoogleMap)
├── hooks/          # 커스텀 훅 14개 (useChainScroll, useGeolocation 등)
├── store/          # Zustand 스토어 (app, user, theme, permission 등)
├── styles/         # 색상 토큰(colors.ts), 글로벌 CSS, 폰트
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수 (time, distance, cookie 등)
└── middleware.ts   # 인증 미들웨어 — 보호 라우트 자동 리다이렉트
```

### 경로 별칭

`tsconfig.paths.json`에 정의된 경로 별칭입니다. 모든 import에서 사용합니다.

| 별칭 | 경로 |
|------|------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@shared/*` | `src/components/shared/*` |
| `@icons/*` | `src/components/icons/*` |
| `@contexts/*` | `src/contexts/*` |
| `@hooks/*` | `src/hooks/*` |
| `@apis/*` | `src/apis/*` |
| `@store/*` | `src/store/*` |
| `@styles/*` | `src/styles/*` |
| `@utils/*` | `src/utils/*` |
| `@constants/*` | `src/constants/*` |
| `@type/*` | `src/types/*` |

---

## 주요 아키텍처

### 인증 흐름

```
WalletConnect/AppKit 주소 연결 → 백엔드에서 JWT 발급 → 쿠키 저장 → 미들웨어가 보호 라우트 가드
```

### API 3중 구조

| 레이어 | 위치 | 역할 |
|--------|------|------|
| **클라이언트 API** | `src/apis/v1/` | Axios 기반, query/mutation 패턴으로 백엔드와 통신 |
| **BFF Route Handlers** | `src/app/api/` | 서버 전용 API 키를 숨기는 프록시 (5개 엔드포인트) |
| **서버 전용 HTTP** | `src/apis/http.server.ts` | SSR에서만 사용하는 HTTP 클라이언트 |

### 모달 시스템

`ModalProvider` 기반 선언적 모달 관리. 두 가지 타입:
- **BottomSheet** — 하단에서 올라오는 패널 (드래그 핸들로 스와이프 닫기 지원)
- **Popup** — 화면 중앙 다이얼로그

### Provider 중첩 순서

`src/app/layout.tsx`에서 다음 순서로 중첩됩니다. **이 순서를 변경하면 앱이 깨질 수 있습니다.**

```
ReactQueryProvider
  └─ WalletProvider
       └─ GoogleMapContext
            └─ NuqsAdapter
                 └─ AppBridge
                      └─ ModalProvider
                           └─ {children}
```

### App Bridge (네이티브 앱 연동)

이 프론트엔드는 웹 브라우저와 **네이티브 앱 WebView** 양쪽에서 실행됩니다.

- `AppBridge` 컴포넌트가 네이티브 앱과의 메시지 통신을 담당
- Tailwind `app` variant (`addVariant('app', '.app &')`)로 WebView 전용 스타일링 적용
- 예: `className="pb-16 app:pb-40"` — 웹에서는 16px, 앱에서는 40px 하단 패딩

---

## 디자인 시스템 & 컨벤션

### 색상

`src/styles/colors.ts`에 정의된 커스텀 팔레트를 사용합니다. `tailwind.config.ts`에서 확장됩니다.

### 폰트

- **Pretendard** — 기본 본문 폰트 (시스템 폰트)
- **Jost** — Google Fonts, 숫자/영문 강조에 사용 (`font-jost`)

### 폰트 사이즈

고정 토큰만 사용합니다. **임의 값(`text-[...]`) 사용 금지.**

```
text-10  text-12  text-14  text-16  text-18
text-20  text-22  text-28  text-40  text-56
```

### 조건부 클래스

`clsx()`를 사용합니다. 템플릿 리터럴로 클래스를 조합하지 않습니다.

```tsx
// ✅ Good
className={clsx('text-14 font-bold', isActive && 'text-primary')}

// ❌ Bad
className={`text-14 font-bold ${isActive ? 'text-primary' : ''}`}
```

### Import 정렬

`@trivago/prettier-plugin-sort-imports`가 자동으로 정렬합니다. 순서:

```
외부 패키지 → @contexts → @store → @type → @components → @shared → @icons → @hooks → @apis → @utils → @constants → @styles → 상대경로
```

### 아이콘

`src/components/icons/` 하위에 SVG 기반 컴포넌트 32개가 있습니다. 공통 `IconProps` 타입(`size`, `color`, `className`)을 사용합니다.

### 다크 모드

class 기반 다크 모드가 설정되어 있습니다 (`darkMode: 'class'`).

---

## 스크립트 & 개발 도구

| 스크립트 | 설명 |
|----------|------|
| `yarn dev` | 개발 서버 실행 (http://localhost:3000) |
| `yarn build` | 프로덕션 빌드 |
| `yarn start` | 프로덕션 서버 실행 |
| `yarn lint` | ESLint 검사 |
| `yarn lint:fix` | ESLint 자동 수정 |

### 코드 품질 도구

- **ESLint** — Next.js + Prettier 확장 규칙
- **Prettier** — 세미콜론 없음, 싱글 쿼트, 120자 줄 폭, import 자동 정렬
- **Tailwind 클래스 정렬** — `prettier-plugin-tailwindcss`가 자동으로 클래스 순서 정리

---

## 배포 & CI/CD

### 호스팅

**Vercel**에서 호스팅됩니다. 배포 설정은 Vercel 대시보드에서 관리합니다.

### CI/CD

| 워크플로우 | 트리거 | 동작 |
|------------|--------|------|
| `notify-bot-repo.yml` | `main` 브랜치에 `src/` 변경 push | `open-run-smartbot` 레포에 webhook 전송 (RAG 문서 동기화) |

> ⚠️ 별도의 테스트/린트 CI 파이프라인은 아직 구축되지 않았습니다.

---

## 알려진 제약사항

| 항목 | 상태 | 설명 |
|------|------|------|
| **Testnet 전용** | 🔶 진행 중 | 현재 Base Sepolia testnet에서만 동작합니다. Mainnet 전환은 TODO 상태입니다. |
| **react-query 이중 의존성** | 🔶 진행 중 | `@tanstack/react-query@5`와 레거시 `react-query@3`가 공존합니다. v5로 마이그레이션 진행 중입니다. |
| **테스트 미도입** | ⬜ 미착수 | 테스트 파일과 test 스크립트가 없습니다. |
| **@types/react 버전** | ℹ️ 참고 | `@types/react@^18` (devDep)과 `react@^19` (런타임) 버전이 불일치합니다. 실사용에 영향은 없습니다. |
