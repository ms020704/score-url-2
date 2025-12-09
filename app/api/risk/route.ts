// app/api/risk/route.ts (새로 생성)
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db-connect';
import ScanResultModel from '@/lib/models/ScanResult';

export async function GET() {
  try {
    await dbConnect();

    // 요청사항 4번 반영: 고위험 등급(F)인 사이트를 찾아 최신순으로 3개 가져옴
    const highRiskScans = await ScanResultModel.find({ trustLevel: 'F' })
      .sort({ scanDate: -1 })
      .limit(3)
      .select('url score trustLevel scanDate');

    return NextResponse.json(highRiskScans);
  } catch (error: any) {
    console.error('High Risk API Error:', error.message);
    return NextResponse.json({ error: '고위험군 조회 실패' }, { status: 500 });
  }
}
