# Nocturne Mail — Design Notes

## Approach 01 — Neo Kinpaku Desk

**Very Brief Intro:** 어두운 우루시 래커 위에 금박의 얇은 선과 청록색 파티나를 올린 정밀한 작업대. 메일을 단순한 목록이 아니라 집중과 판단을 위한 조용한 도구로 느끼게 한다.

**Probability:** 0.07

## Approach 02 — Quiet Paper Correspondence

**Very Brief Intro:** 따뜻한 종이, 여백, 잉크색 텍스트, 절제된 세리프를 중심으로 만든 현대적 서신함. 개인 아카이브와 사적인 편지의 온도를 강조한다.

**Probability:** 0.03

## Approach 03 — Alpine Signal Room

**Very Brief Intro:** 차가운 회백색 바탕과 신호등 같은 코발트 포인트를 사용하는 스위스식 정보 패널. 속도와 명료성을 최우선에 둔 운영 도구의 인상을 준다.

**Probability:** 0.05

## Chosen Direction — Neo Kinpaku Desk

### Design Movement
Neo Kinpaku: 일본식 금박 공예의 불규칙한 결, 우루시 래커의 깊은 표면, 그리고 현대적 계기판의 정밀한 선을 결합한 디지털 제품 미학.

### Core Principles
1. **장식은 구조가 된다.** 금색 선, 눈금, 짧은 레이블은 장식이 아니라 읽기 순서와 상태를 안내하는 기능적 표식이다.
2. **어두움은 순수한 검정이 아니다.** 따뜻한 흑갈색의 래커 표면과 흑연 단계를 사용해 평면 검정을 피한다.
3. **밀도와 여백을 함께 둔다.** 메일 목록은 효율적으로 촘촘하게, 제목·검색·오른쪽 정보 패널은 숨을 쉴 여백으로 분리한다.
4. **상호작용은 조용하고 즉각적이다.** 강한 글로우나 탄성 효과 대신 100–180ms의 짧은 이동, 금박 하이라이트, 명확한 상태 변화로 반응한다.

### Color Philosophy
고유 색상은 **Kinpaku Gold `oklch(84% 0.19 80.46)`**로, 중요한 행동과 선택 상태에만 사용한다. 페이지의 바닥은 **Lacquer Black `oklch(7% 0.006 95)`**, 패널은 **Raised Lacquer `oklch(11% 0.006 95)`**로 나누어 깊이를 만든다. **Verdigris Patina `oklch(70% 0.12 188)`**는 읽지 않음, 동기화, 개선 같은 상태에만 사용해 금색의 희소성을 지킨다. 순수한 검정·회색·보라 그라디언트는 사용하지 않는다.

### Layout Paradigm
고정된 왼쪽 네비게이션, 중앙의 넓은 메일 작업 영역, 오른쪽의 얇은 컨텍스트 레일을 두는 **비대칭 3단 작업대**. 중앙은 12-column grid가 아니라 메일 리스트와 읽기 영역의 유연한 분할로 구성한다. 모바일에서는 오른쪽 레일을 접고 왼쪽 네비게이션을 bottom sheet 성격의 drawer로 바꾼다.

### Signature Elements
- 금박 캘리브레이션 라인: 섹션 상단, 검색 입력, 선택된 메일의 왼쪽에 1px 골드 라인을 사용한다.
- 작은 모노스페이스 eyebrow: `INBOX / 07`, `FOCUS TODAY`, `SYNCED 2M AGO`처럼 기능과 상태를 짧게 표시한다.
- 래커 표면 위의 파티나 신호: 읽지 않은 메일, 활성 상태, 진행 중인 동기화에 청록색 점과 짧은 라벨을 사용한다.

### Interaction Philosophy
사용자가 현재 어디에 있는지 항상 보여준다. 메일 행은 전체가 클릭 가능하되, star·archive·more 같은 보조 행동은 독립적으로 키보드 접근이 가능하다. 검색은 즉시 필터링하고, compose는 고정된 금색 primary action으로 유지한다. 구현하지 않은 버튼은 무반응으로 두지 않고 `준비 중인 기능입니다` 토스트로 알려준다.

### Animation
초기 화면은 30–60ms 간격의 짧은 stagger로 메일 행이 들어온다. 검색·필터·탭은 레이아웃을 흔들지 않고 opacity와 transform만 사용한다. compose 패널은 trigger origin에서 `scale(0.96) + opacity: 0`으로 시작해 220ms ease-out으로 나타난다. 버튼 active는 160ms 동안 `scale(0.97)`로 눌림을 확인시킨다. `prefers-reduced-motion`에서는 stagger와 장식 움직임을 제거한다.

### Typography System
- Display / 브랜드: **Alumni Sans** 400, 넓은 자간의 작은 워드마크.
- UI / 본문: **Albert Sans** 400–600, 메일 제목과 제어 요소의 가독성을 담당.
- Metadata / 상태: **Roboto Mono** 또는 시스템 모노스페이스, 10–12px, 넓은 자간.
- 페이지 제목은 32–40px, 섹션 제목은 20–24px, 본문은 14–16px, 메타는 11–12px로 단계화한다.

### Brand Essence
**개인 메일을 집중된 작업대로 바꾸는 고급 웹메일 인터페이스 — 사적인 편지와 중요한 업무를 조용히 정리하고 싶은 사람을 위해, 금박 같은 상태 표식과 비대칭 정보 구조로 차별화한다.**

Personality: **정제된, 집중된, 물성적인**

### Brand Voice
헤드라인은 짧고 관찰적이며, CTA는 동작을 정확히 말한다. 과장된 생산성 문구, `Welcome to our website`, `Get started today` 같은 빈 문장은 배제한다.

- Example headline: `Your attention, in one place.`
- Example CTA: `Compose a note`

### Wordmark & Logo
텍스트를 기본 폰트로 찍지 않는다. 워드마크는 넓은 자간의 `NOCTURNE` 레터링으로 만들고, 로고는 봉투의 접힌 모서리와 금박 균열을 결합한 **N자형 기하학 심볼**로 사용한다. 아이콘은 헤더와 favicon에서 충분한 크기로 노출한다.

### Signature Brand Color
**Kinpaku Gold — `oklch(84% 0.19 80.46)`**. 어두운 래커 위에서만 가장 강하게 빛나는, Nocturne Mail의 소유 가능한 기준색이다.

## Build Notes

- 정적 프론트엔드 범위로 구현하며 실제 메일 서버 연결은 포함하지 않는다.
- 목업 데이터는 UI 상태와 상호작용을 보여주기 위한 화면 데이터로만 사용한다.
- 주요 버튼: Compose, 검색, 새로고침, 별표, 보관, 삭제, 더보기, 폴더 이동, 읽음/안읽음 전환.
- 반응형 기준: 데스크톱 3열, 태블릿 2열, 모바일 단일 열 + 접이식 네비게이션.
- 사용자 요청 언어에 맞춰 인터페이스 카피는 한국어를 기본으로 하되, 브랜드/상태 레이블은 Neo Kinpaku의 영문 모노 레이블을 유지한다.
