# AI 스터디 버디 (AI Study Buddy)

## 📖 프로젝트 소개

**AI 스터디 버디**는 학습 내용을 효과적으로 기억하고 싶어하는 학생들을 위한 지능형 학습 파트너입니다. 에빙하우스의 망각 곡선 이론에 기반하여 최적의 복습 시점을 알려주고, 사용자가 작성한 학습 노트를 바탕으로 개인화된 AI 퀴즈를 생성하여 장기 기억력 향상을 돕습니다.

<br/>

## ✨ 주요 기능

* **🧠 지능형 노트 정리**: 학습한 내용을 자유롭게 노트에 기록하면 AI가 핵심 내용을 파악하여 퀴즈 생성에 활용합니다.
* **🤖 개인화된 AI 퀴즈 생성**: 각 노트의 내용을 기반으로 Google Gemini AI가 난이도별(상/중/하) 맞춤형 퀴즈를 자동으로 생성합니다. 이를 통해 단순 암기가 아닌, 능동적 회상(Active Recall)을 통한 깊이 있는 학습을 유도합니다.
* **📅 망각 곡선 기반 복습 스케줄링**: 노트를 저장하면 망각 곡선 이론에 따라 1일, 3일, 7일 뒤를 최적의 복습 시점으로 자동 예약합니다. 복습할 때가 된 노트는 대시보드에 따로 표시됩니다.
* **✅ 연습 퀴즈와 복습 퀴즈**: 언제든지 부담 없이 풀어볼 수 있는 '연습 퀴즈'와 복습 시점에 맞춰 지식을 점검하는 '복습 퀴즈' 모드를 제공합니다.
* **🔐 구글 계정 연동**: 간편하게 구글 계정으로 로그인하여 학습 기록을 안전하게 관리할 수 있습니다.

<br/>

## 🛠️ 기술 스택

* **Frontend**: React, TypeScript, Vite
* **Styling**: Tailwind CSS
* **AI**: Google Gemini API (@google/genai)
* **Authentication**: Google OAuth (@react-oauth/google)
* **State Management**: React Hooks (useState, useEffect, useCallback), LocalStorage

<br/>

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone [https://github.com/your-username/ai-study-buddy.git](https://github.com/your-username/ai-study-buddy.git)
cd ai-study-buddy
````

### 2\. 의존성 설치

```bash
npm install
```

### 3\. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 아래 내용을 채워주세요.

```
# Google AI Studio에서 발급받은 Gemini API 키
VITE_API_KEY="YOUR_GEMINI_API_KEY"

# Google Cloud Console에서 발급받은 OAuth 2.0 클라이언트 ID
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

### 4\. 개발 서버 실행

```bash
npm run dev
```

이제 `http://localhost:5173` 에서 AI 스터디 버디를 만나보실 수 있습니다!

```
```
