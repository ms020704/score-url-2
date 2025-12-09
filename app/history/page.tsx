'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface HistoryItem {
  _id: string
  url: string
  score: number
  trustLevel: string
  scanDate: string
}

// URL 정규화 함수
function normalize(url: string): string {
  try {
    const u = new URL(url.trim())
    u.protocol = 'https:'
    let normalized = u.toString()

    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1)
    }

    return normalized.toLowerCase()
  } catch {
    return url.trim().toLowerCase()
  }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/history')

        if (response.status === 401) {
          router.push('/sign-in')
          return
        }

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || '기록 조회에 실패했습니다.')
          setHistory([])
          return
        }

        // 최근순 정렬
        data.sort(
          (a: HistoryItem, b: HistoryItem) =>
            new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime()
        )

        // 중복 제거 (정규화된 URL 기준)
        const uniqueMap = new Map<string, HistoryItem>()
        data.forEach((item: HistoryItem) => {
          const key = normalize(item.url)
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item)
          }
        })

        setHistory(Array.from(uniqueMap.values()))
      } catch (err) {
        setError('네트워크 오류로 기록을 가져올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])

  if (loading) {
    return (
      <p className="text-center text-xl mt-16 text-slate-500">
        기록을 불러오는 중입니다...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-xl mt-16 text-red-400">
        오류 발생: {error}
      </p>
    )
  }

  if (history.length === 0) {
    return (
      <p className="text-center text-xl mt-16 text-slate-500">
        분석 기록이 없습니다.
      </p>
    )
  }

  // 위험 / 보통 / 안전 그룹 분리
  const danger = history.filter((h) => h.score < 40)
  const normal = history.filter((h) => h.score >= 40 && h.score < 80)
  const safe = history.filter((h) => h.score >= 80)

  const Section = ({
    title,
    color,
    items,
  }: {
    title: string
    color: string
    items: HistoryItem[]
  }) => (
    <div className="mt-10">
      <h2 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h2>

      {items.length === 0 && (
        <p className="text-slate-500 text-sm mb-6">기록 없음</p>
      )}

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border border-slate-300"
          >
            <div className="flex flex-col">
              <span className="text-lg font-medium text-slate-800 truncate w-96 md:w-auto">
                {item.url}
              </span>
              <span className="text-xs text-slate-500">
                분석 일시:{' '}
                {format(new Date(item.scanDate), 'yyyy.MM.dd HH:mm:ss')}
              </span>
            </div>

            <span
              className={`px-3 py-1 text-sm font-bold rounded-full ${
                item.score >= 80
                  ? 'bg-green-200 text-green-800'
                  : item.score >= 40
                  ? 'bg-yellow-200 text-yellow-700'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              점수: {item.score} ({item.trustLevel})
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-slate-900">최근 분석 기록</h1>

      <Section title="위험 URL" color="text-red-600" items={danger} />
      <Section title="보통 URL" color="text-yellow-600" items={normal} />
      <Section title="안전 URL" color="text-green-600" items={safe} />
    </div>
  )
}
