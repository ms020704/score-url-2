// app/page.tsx
'use client'

import { useState } from 'react'
import IntroSection from './components/IntroSection'
import UrlInputForm from './components/UrlInputForm'
import ResultCard from './components/ResultCard'
import { ScanResult } from '@/lib/types'

export default function HomePage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (url: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        const msg = data.error || data.detail || '분석 중 오류가 발생했습니다.'
        setError(msg)
        return
      }

      setResult(data as ScanResult)
    } catch (err) {
      setError('네트워크 오류 또는 서버에 접속할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 🔴 여기 래퍼가 핵심 수정 부분 */}
      <IntroSection />

      {/* URL 입력 폼 */}
      <UrlInputForm onSubmit={handleScan} disabled={loading} />

      {/* 로딩/에러/결과 영역 */}
      <div className="mt-6">
        {loading && (
          <p className="text-center text-lg font-medium text-yellow-400">
            URL을 분석하는 중입니다...
          </p>
        )}

        {error && (
          <p className="text-center text-lg font-medium text-red-500">
            🚨 {error}
          </p>
        )}

        {result && <ResultCard result={result} />}
      </div>
    </div>
  )
}
