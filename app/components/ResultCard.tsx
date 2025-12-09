// app/components/ResultCard.tsx

import { ScanResult } from '@/lib/types'

// 상태(status)에 따른 색상 스타일 반환
const getStatusClasses = (status: ScanResult['status']) => {
  switch (status) {
    case 'safe':
      return 'bg-emerald-600 border-emerald-500'
    case 'warning':
      return 'bg-yellow-600 border-yellow-500'
    case 'danger':
      return 'bg-red-600 border-red-500'
    default:
      return 'bg-slate-600 border-slate-500'
  }
}

export default function ResultCard({ result }: { result: ScanResult }) {
  const statusLabel = {
    safe: '안전',
    warning: '주의',
    danger: '위험',
  }[result.status]

  const statusClass = getStatusClasses(result.status)

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 max-w-3xl mx-auto mt-8 shadow-xl">
      {/* 상태 + 분석 URL */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-700">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${statusClass}`}
        >
          상태: {statusLabel} ({result.trustLevel})
        </span>

        <span className="text-sm text-slate-300">
          분석 대상:{' '}
          <span className="text-white font-medium break-all">{result.url}</span>
        </span>
      </div>

      {/* 점수 */}
      <div className="mt-4 text-5xl font-extrabold text-white text-center">
        {result.score}
        <span className="text-xl text-slate-400"> / 100</span>
      </div>

      {/* 상세 메시지 */}
      <p className="mt-4 text-sm text-slate-300 text-center">{result.detail}</p>

      {/* API 상세 정보 */}
      <div className="mt-6 border-t border-slate-700 pt-4 space-y-2 text-xs text-slate-400">
        <p>
          Google Safe Browsing 위협:
          <span className="font-mono text-white ml-2">
            {result.gsbThreats?.length > 0
              ? result.gsbThreats.join(', ')
              : '없음'}
          </span>
        </p>

        <p>
          VirusTotal 탐지율:
          <span className="font-mono text-white ml-2">
            {result.vtStats?.positives} / {result.vtStats?.total}
          </span>
        </p>
      </div>
    </section>
  )
}
