import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full animate-in fade-in-0 zoom-in-95 duration-300 flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat Datang USSIans
          </h1>
          <p className="text-sm text-muted-foreground">
            PT USSI Siap Melayani dengan sepenuh hati
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Registrasi di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
