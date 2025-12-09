// app/api/score/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { dbConnect } from '@/lib/db-connect'
import ScanResultModel from '@/lib/models/ScanResult'
import { checkGoogleSafeBrowsing } from '@/lib/gsb'
import { checkVirusTotal } from '@/lib/virustotal'
import { calculateScore } from '@/lib/scoring'
import { normalizeUrl } from '@/lib/utils'
import { ScanResult } from '@/lib/types'

export async function POST(request: Request) {
  // 1. 인증 체크
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Authentication Required', { status: 401 })
  }

  // 2. 요청 body 파싱
  const body = await request.json().catch(() => null)
  if (!body || !body.url) {
    return NextResponse.json(
      { error: 'url 필드가 필요합니다.' },
      { status: 400 }
    )
  }

  // 3. URL 정규화
  const normalizedUrl = normalizeUrl(body.url)
  if (!normalizedUrl) {
    return NextResponse.json(
      { error: '올바른 URL 형식이 아닙니다.' },
      { status: 400 }
    )
  }

  try {
    // 4. 외부 API 호출
    const gsbThreats = await checkGoogleSafeBrowsing(normalizedUrl)
    const vtStats = await checkVirusTotal(normalizedUrl)

    // 5. 점수 계산
    const scoreBase = calculateScore(gsbThreats, vtStats, normalizedUrl)

    const scanResult: ScanResult = {
      ...scoreBase,
      url: normalizedUrl,
    }

    // 6. DB 저장
    try {
      await dbConnect()
      await ScanResultModel.create({
        userId,
        url: normalizedUrl,
        score: scanResult.score,
        trustLevel: scanResult.trustLevel,
        apiResults: {
          googleSafeBrowsing: gsbThreats,
          virusTotal: vtStats,
        },
      })
    } catch (dbErr) {
      console.error('MongoDB 저장 오류:', dbErr)
    }

    // 7. 결과 반환
    return NextResponse.json(scanResult, { status: 200 })
  } catch (error: any) {
    console.error('API Process Error:', error.message)
    return NextResponse.json(
      {
        error: '서버 내부 오류가 발생했습니다.',
        detail: error.message,
      },
      { status: 500 }
    )
  }
}

// GET 메서드 차단
export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method to scan URL' },
    { status: 405 }
  )
}
