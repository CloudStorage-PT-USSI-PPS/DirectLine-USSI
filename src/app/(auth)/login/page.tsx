
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/layout/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-0"/>
      <Card className="relative z-10 w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-300 shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
            <div className='mx-auto mb-4'>
                <Logo />
            </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Selamat Datang USSIans
          </CardTitle>
          <CardDescription>
            PT USSI Siap Melayani dengan sepenuh hati
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Registrasi di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
