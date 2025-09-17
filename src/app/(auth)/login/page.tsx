import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/layout/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email dan password Anda untuk masuk
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
