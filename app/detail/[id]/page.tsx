'use client'

import { useParams } from 'next/navigation'

export default function DetailPage() {
  const params = useParams()
  const scanId = params.id

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">분석 상세 보고서</h1>

      <p className="text-slate-600 text-sm">
        요청 ID: <span className="font-mono text-indigo-600">{scanId}</span>
      </p>

      <div className="border border-slate-300 bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          API 응답 원본 (추가 구현 필요)
        </h2>
        <p className="text-slate-600 text-sm">
          현재는 더미 데이터가 표시됩니다. 추후 백엔드/DB 연동을 통해 실제
          데이터를 가져와 표시할 예정입니다.
        </p>

        <div className="bg-black text-green-400 text-xs p-4 rounded overflow-x-auto font-mono">
          {`{
  "status": "warning",
  "score": 75,
  "gsb_matches": ["PHISHING_ATTEMPT"],
  "vt_positives": 3
}`}
        </div>
      </div>
    </div>
  )
}
