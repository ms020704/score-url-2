// app/components/UserButtonClient.tsx
'use client';

import { UserButton } from '@clerk/nextjs';

export default function UserButtonClient() {
  return <UserButton afterSignOutUrl="/" />; // 로그아웃 후 메인으로
}
