export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 text-slate-900">
      <h1 className="text-4xl font-bold mb-6">Score-URL 프로젝트 소개</h1>

      <section className="space-y-3">
        <p className="leading-relaxed">
          Score-URL은 사용자가 입력한 URL을 여러 보안 API(Google Safe Browsing,
          VirusTotal)와 자체 분석 알고리즘을 기반으로 평가하여 악성 여부와 위험
          점수를 제공하는 웹 서비스입니다.
        </p>
        <p className="leading-relaxed">
          URL 기반 공격(피싱, 멀웨어 배포, 의심 사이트 등)이 증가함에 따라
          사용자가 직접 URL을 분석하고 안전성을 판단할 수 있도록 돕는 것을
          목표로 합니다.
        </p>
      </section>

      <section className="bg-slate-200 p-6 rounded-xl space-y-3">
        <h2 className="text-2xl font-bold">서비스 기능</h2>
        <ul className="list-disc ml-6">
          <li>URL 위험 점수 분석 및 신뢰도 등급(A~F) 제공</li>
          <li>Google Safe Browsing 기반 악성·피싱 탐지</li>
          <li>VirusTotal 기반 탐지 수집 및 점수 반영</li>
          <li>사용자별 URL 분석 기록 저장 및 분류 기능</li>
          <li>Clerk 인증 기반 사용자 보호 및 접근 제어</li>
        </ul>
      </section>

      <section className="bg-slate-200 p-6 rounded-xl space-y-3">
        <h2 className="text-2xl font-bold">기술 스택</h2>
        <ul className="list-disc ml-6">
          <li>프론트엔드: Next.js 14, React, Tailwind CSS</li>
          <li>백엔드 API: Next.js Route Handlers</li>
          <li>데이터베이스: MongoDB + Mongoose</li>
          <li>인증: Clerk 사용자 인증</li>
          <li>외부 API: Google Safe Browsing, VirusTotal</li>
        </ul>
      </section>

      <section className="bg-slate-200 p-6 rounded-xl space-y-4">
        <h2 className="text-2xl font-bold">프로젝트 팀 구성</h2>

        <ul className="list-disc ml-6">
          <li>
            프론트엔드: 곽남호 (UI 설계, 컴포넌트 디자인, 전체 페이지 구현,
            프론트엔드 구조 구성, 코드 병합 및 Vercel 배포 담당)
          </li>
          <li>
            백엔드/API: 김현식, 박성준 (Google Safe Browsing 및 VirusTotal API
            연동, URL 위험도 점수 알고리즘 구현)
          </li>
          <li>
            DB 설계 및 모델 구성: 오소망(DB 구조 설계, ScanResult 모델 정의,
            사용자별 URL 기록 저장 구조 구성)
          </li>
        </ul>
      </section>

      <section className="bg-slate-200 p-6 rounded-xl space-y-4">
        <h2 className="text-2xl font-bold">팀원 프로젝트 링크</h2>

        <ul className="list-disc ml-6">
          <li>곽남호(프로젝트 이름 or 설명): </li>
          <li>김민석(프로젝트 이름 or 설명): </li>
          <li>박성준(프로젝트 이름 or 설명): </li>
          <li>오소망(프로젝트 이름 or 설명): </li>
        </ul>
      </section>
    </div>
  )
}
