
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, History, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';
import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const clientNavItems = [
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/konsultasi', label: 'Konsultasi', icon: Users },
  { href: '/history', label: 'Riwayat', icon: History },
];

export function ClientNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center md:mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {clientNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 transition-colors hover:text-foreground/80',
                pathname === item.href
                  ? 'font-semibold text-foreground'
                  : 'text-foreground/60'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <nav className="flex flex-col gap-4 p-4 text-base">
                    {clientNavItems.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
                            pathname === item.href
                            ? 'bg-muted font-semibold text-foreground'
                            : 'text-muted-foreground'
                        )}
                        >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                        </Link>
                    ))}
                    </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
