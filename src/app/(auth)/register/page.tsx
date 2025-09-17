import { RegisterForm } from '@/components/auth/register-form';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan detail Anda untuk membuat akun
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
