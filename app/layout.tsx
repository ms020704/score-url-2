// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import UserButtonClient from './components/UserButtonClient'

export const metadata: Metadata = {
  title: 'Score-URL',
  description: 'URL 보안 점수 분석 서비스',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  return (
    <ClerkProvider>
      <html lang="ko">
        <body className="min-h-screen bg-slate-950 text-slate-100">
          <div className="flex min-h-screen flex-col">
            {/* --- 헤더 (사이즈 확대 버전) --- */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* 왼쪽 로고 */}
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-slate-900">
                    SCORE
                  </span>

                  {/* 기존 text-sm → text-lg 로 확대 */}
                  <Link
                    href="/"
                    className="text-lg font-semibold hover:text-white"
                  >
                    Score-URL
                  </Link>
                </div>

                {/* 오른쪽 메뉴 + 로그인 */}
                <div className="flex items-center gap-6">
                  {/* 기존 text-xs → text-base 로 확대 */}
                  <nav className="flex gap-6 text-base text-slate-300">
                    <Link href="/" className="hover:text-white">
                      홈
                    </Link>
                    <Link href="/history" className="hover:text-white">
                      기록
                    </Link>
                    <Link href="/about" className="hover:text-white">
                      소개
                    </Link>
                  </nav>

                  {/* 로그인 버튼 크기 확대 */}
                  {userId ? (
                    <UserButtonClient />
                  ) : (
                    <Link
                      href="/sign-in"
                      className="rounded bg-indigo-600 px-4 py-1.5 text-base text-white hover:bg-indigo-700"
                    >
                      로그인
                    </Link>
                  )}
                </div>
              </div>
            </header>

            {/* --- 메인 --- */}
            <main className="flex-1">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>

            {/* --- 푸터 --- */}
            <footer className="border-t border-slate-800 bg-slate-900/80">
              <div className="container mx-auto flex h-10 items-center justify-between px-4 text-xs text-slate-400">
                <span>© 2025 Score-URL Project</span>
                <span>중부대학교 웹 서버 보안 프로그래밍</span>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
