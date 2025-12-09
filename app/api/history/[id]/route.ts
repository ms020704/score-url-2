// app/api/history/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/db-connect';
import ScanResultModel from '@/lib/models/ScanResult';

// DELETE: 특정 ID의 기록 삭제
export async function DELETE(
  request: Request,
  // 💡 수정됨: params를 Promise로 타입 정의
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 💡 수정됨: params를 await으로 기다려서 id 추출
    const { id } = await params;

    await dbConnect();

    const deletedItem = await ScanResultModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedItem) {
      return NextResponse.json(
        { ok: false, message: '기록을 찾을 수 없거나 삭제 권한이 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, message: '삭제되었습니다.' });
  } catch (err: any) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}

// GET: 특정 ID의 상세 정보 조회
export async function GET(
  request: Request,
  // 💡 수정됨: params를 Promise로 타입 정의
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // 💡 수정됨: params를 await으로 기다려서 id 추출
    const { id } = await params;

    await dbConnect();

    const detail = await ScanResultModel.findOne({
      _id: id,
      userId: userId,
    });

    if (!detail) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
