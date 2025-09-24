
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, History } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';
import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';


const allNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['cs'] },
  { href: '/konsultasi', label: 'Konsultasi', icon: MessageSquare, roles: ['cs', 'client'] },
  { href: '/chat', label: 'Chat', icon: MessageSquare, roles: ['client'] },
  { href: '/history', label: 'Riwayat', icon: History, roles: ['client', 'cs'] },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = allNavItems.filter(item => {
    if (!user) return false;
    // Special rule for client's 'Konsultasi' vs 'Chat'
    if (user.role === 'client') {
      if (item.href === '/konsultasi' && allNavItems.some(i => i.href === '/chat' && i.roles.includes('client'))) {
        return true;
      }
    }
    return item.roles.includes(user.role);
  }).filter(item => {
      // Hide "Konsultasi" from CS if they also have a dashboard
      if (user?.role === 'cs' && item.href === '/konsultasi') {
          return allNavItems.some(i => i.href === '/dashboard' && i.roles.includes('cs'));
      }
      return true;
  });


  const clientNavItems = allNavItems.filter(item => user && item.roles.includes('client') && item.label !== 'Konsultasi');
  const csNavItems = allNavItems.filter(item => user && item.roles.includes('cs'));

  const finalNavItems = user?.role === 'client' ? clientNavItems.concat(allNavItems.find(item => item.label ==='Konsultasi' && item.roles.includes('client'))!) : csNavItems;


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center md:mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {finalNavItems.filter(Boolean).map((item) => (
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
          
          {/* Mobile Navigation Trigger */}
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
                    <SheetDescription className="sr-only">
                        Menu navigasi utama
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <nav className="flex flex-col gap-4 p-4 text-base">
                    {finalNavItems.filter(Boolean).map((item) => (
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

