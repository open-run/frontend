# OpenRun Frontend

**함께 달리고, 함께 성장하는 러닝 커뮤니티 플랫폼**

OpenRun은 동네 러닝 모임("벙")을 만들고 참여하며, 챌린지를 완료해 NFT 보상을 받는 웹3 기반 커뮤니티 서비스입니다. 이 레포지토리는 웹 브라우저와 모바일 앱 WebView 양쪽에서 동작하는 프론트엔드입니다.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Base](https://img.shields.io/badge/Base-Sepolia-0052FF?logo=coinbase)

---

## 서비스 구조

OpenRun은 세 개의 레포지토리로 구성됩니다. 이 프론트엔드가 사용자와 만나는 핵심 인터페이스입니다.

```
                    ┌──────────────────────────┐
                    │   Backend (Spring Boot)   │
                    │   Java 17 · MySQL · Web3j │
                    └────────────┬─────────────┘
                                 │ REST API + JWT
                                 ▼
                    ┌──────────────────────────┐
                    │   Frontend (Next.js) ◀── 이 레포
                    │   Vercel 배포            │
                    │   BFF 프록시 (지도·날씨)  │
                    └──────┬───────────┬───────┘
                           │           │
                    브라우저 접속    WebView 로드
                           │           │
                           ▼           ▼
                      웹 사용자   ┌──────────────┐
                                 │ Mobile App   │
                                 │ Expo · RN    │
                                 │ 네이티브 지갑 │
                                 └──────────────┘
```

---

## 주요 기능

### 벙 (러닝 모임)

OpenRun의 핵심 기능입니다. 사용자가 러닝 모임을 직접 만들고, 다른 사람의 모임에 참여합니다.

- 모임 생성: 날짜, 장소, 거리, 페이스, 인원 제한 설정
- Google Maps 연동: 모임 장소를 지도에서 선택하고 확인
- 실시간 카운트다운: 모임 시작까지 남은 시간 표시
- **GPS 참여 인증**: 모임 장소 500m 이내에서만 참여 인증 가능 (부정 참여 방지)
- 모임 관리: 멤버 관리, 방장 위임, 뒷풀이 정보 등

### 챌린지 & NFT 보상

개인 러닝 목표를 설정하고, 달성하면 NFT를 받습니다.

- 일반 챌린지: 단발성 목표 (예: "5km 완주")
- 반복 챌린지: 주기적 목표 (예: "주 3회 러닝을 4주간")
- 챌린지 완료 시 Base 체인에서 NFT 민팅 (rarity: common / rare / epic)
- 프로필에서 획득한 NFT 컬렉션 확인

### 탐색 & 검색

- 주변 러닝 모임 탐색 및 추천
- 해시태그, 장소, 닉네임으로 퍼지 검색 (Fuse.js)

### 모바일 앱 연동

하나의 코드베이스가 웹과 앱 양쪽에서 동작합니다.

- AppBridge를 통한 네이티브 앱 메시지 통신
- Tailwind `app` variant로 WebView 전용 스타일 분기 (예: `pb-16 app:pb-40`)
- 네이티브 앱에서 Smart Wallet 서명 처리

---

## 기술 스택

| 카테고리 | 기술 |
|----------|------|
| **프레임워크** | Next.js 15 (App Router), React 19 |
| **언어** | TypeScript 5 |
| **블록체인** | wagmi 2, viem 2, Coinbase OnChainKit (Base Sepolia) |
| **상태 관리** | Zustand, TanStack React Query 5, nuqs (URL state) |
| **스타일링** | Tailwind CSS 3, Framer Motion |
| **지도** | @vis.gl/react-google-maps |
| **패키지 매니저** | Yarn 4.0.2 |

---

## 시작하기

### 사전 요구사항

- **Node.js** 20+ (`.nvmrc` 참조)
- **Yarn 4** (`corepack`으로 활성화)

### 설치 및 실행

```bash
corepack enable
yarn install
cp .env.example .env   # 실제 API 키를 입력
yarn dev               # http://localhost:6050
```

`http://localhost:6050` 접속 시 `/signin`으로 리다이렉트되면 정상입니다. 미들웨어가 인증되지 않은 요청을 로그인 페이지로 보냅니다.

### 환경 변수

`.env.example`을 `.env`로 복사한 뒤 값을 입력합니다.

**Client-side** (`NEXT_PUBLIC_*` — 브라우저에 노출)

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `NEXT_PUBLIC_API_SERVER_URL` | 백엔드 API 서버 URL | 팀 내부 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (지도 렌더링) | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Coinbase OnChainKit | [Coinbase Developer Portal](https://portal.cdp.coinbase.com/) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect | [WalletConnect Cloud](https://cloud.walletconnect.com/) |

**Server-side** (서버 전용 — 브라우저에 노출되지 않음)

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `GOOGLE_API_KEY` | Google Geocoding / Places | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `OPENWEATHER_API_KEY` | 날씨 정보 | [OpenWeather](https://home.openweathermap.org/api_keys) |

### 스크립트

| 명령어 | 설명 |
|--------|------|
| `yarn dev` | 개발 서버 (http://localhost:6050) |
| `yarn build` | 프로덕션 빌드 |
| `yarn start` | 프로덕션 서버 |
| `yarn lint` | ESLint 검사 |
| `yarn lint:fix` | ESLint 자동 수정 |

---

## 프로젝트 구조

```
src/
├── app/                # Next.js App Router
│   ├── (private)/      #   인증 필요: 홈, 벙, 챌린지, 프로필, 아바타
│   ├── api/            #   BFF 프록시 (geocoding, places, weather)
│   ├── signin/         #   Smart Wallet 로그인
│   └── register/       #   회원가입 (닉네임, 페이스, 빈도)
├── apis/               # Axios 기반 API 클라이언트 (v1/)
├── components/         # 기능별 컴포넌트 + shared/ + icons/
├── contexts/           # Provider (Modal, Wallet, GoogleMap, ReactQuery)
├── hooks/              # 커스텀 훅 (useChainScroll, useGeolocation 등)
├── store/              # Zustand 스토어 (user, app, mint, theme)
├── styles/             # 색상 토큰, 글로벌 CSS, 폰트
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 (time, distance, cookie 등)
└── middleware.ts       # 인증 미들웨어
```

### 인증 흐름

```
Smart Wallet 서명 → 백엔드에서 JWT 발급 → 쿠키 저장 → 미들웨어가 보호 라우트 가드
```

### API 레이어

| 레이어 | 위치 | 역할 |
|--------|------|------|
| 클라이언트 API | `src/apis/v1/` | 브라우저에서 백엔드와 직접 통신 |
| BFF 프록시 | `src/app/api/` | 서버 전용 API 키를 숨기는 프록시 (4개 엔드포인트) |
| 서버 전용 HTTP | `src/apis/http.server.ts` | SSR 전용 HTTP 클라이언트 |

---

## 배포

**Vercel**에서 호스팅됩니다. `main` 브랜치 push 시 자동 배포됩니다.

---

## 현재 상태

OpenRun은 MVP 단계의 프로젝트입니다.

| 항목 | 상태 | 비고 |
|------|------|------|
| 벙 생성/참여/인증 | ✅ 동작 | 핵심 기능 완성 |
| 챌린지 & NFT 민팅 | ✅ 동작 | Base Sepolia testnet 한정 |
| 아바타 커스터마이징 | 🔶 진행 중 | 기본 구조만 구현, UI 미완성 |
| 테스트 | ⬜ 미착수 | 테스트 코드 없음 |
| Mainnet 전환 | ⬜ 미착수 | 현재 testnet 전용 |
