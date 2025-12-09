// app/api/history/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { dbConnect } from '@/lib/db-connect'
import ScanResultModel from '@/lib/models/ScanResult'

export async function GET() {
  // 1. 인증 확인
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Authentication Required', { status: 401 })
  }

  try {
    // 2. DB 연결
    await dbConnect()

    // 3. URL 기준 최신 1개의 기록만 가져오기
    const history = await ScanResultModel.aggregate([
      { $match: { userId } }, // 본인 기록만 가져오기
      { $sort: { scanDate: -1 } }, // 최신순 정렬
      {
        $group: {
          _id: '$url', // URL 기준 그룹화
          doc: { $first: '$$ROOT' }, // 각 그룹에서 최신 1개만 선택
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { scanDate: -1 } }, // 최종 정렬
    ]).limit(50) // 최대 50개 제한

    return NextResponse.json(history)
  } catch (error: any) {
    console.error('History API Error:', error.message)
    return NextResponse.json(
      { error: '기록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}
