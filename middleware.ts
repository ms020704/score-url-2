// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  // '/api/score', '/api/history', '/history' UI 페이지를 보호하도록 설정
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/api/score(.*)',
    '/api/history(.*)',
    '/history(.*)',
  ],
};
