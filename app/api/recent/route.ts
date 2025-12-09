// app/api/recent/route.ts (새로 생성)
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db-connect';
import ScanResultModel from '@/lib/models/ScanResult';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // URL 쿼리 파라미터에서 page 번호 가져오기 (예: /api/recent?page=2)
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');

    // 페이지 번호가 없으면 기본값 1
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = 20; // 한 페이지당 20개

    // 요청사항 3번 반영: 스킵할 데이터 수 계산
    const skip = (page - 1) * limit;

    const recentScans = await ScanResultModel.find()
      .sort({ scanDate: -1 }) // 최신순
      .skip(skip)
      .limit(limit)
      .select('url score trustLevel scanDate'); // 프론트엔드에 필요한 정보만

    return NextResponse.json(recentScans);
  } catch (error: any) {
    console.error('Recent Scans API Error:', error.message);
    return NextResponse.json({ error: '목록 조회 실패' }, { status: 500 });
  }
}
