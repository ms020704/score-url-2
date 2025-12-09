// app/(auth)/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex h-full items-center justify-center py-20">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/" // 회원가입 성공 후 메인 페이지로 이동
      />
    </div>
  );
}
