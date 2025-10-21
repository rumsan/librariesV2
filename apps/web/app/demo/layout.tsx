'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@rumsan/shadcn/components/button';
import { ArrowLeft } from 'lucide-react';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isOnDemoIndex = pathname === '/demo';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Demo</h1>
          {isHydrated && !isOnDemoIndex && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/demo" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Examples</span>
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Rumsan UI Component Library - Demo Environment</p>
          <p className="mt-2">© 2025 Rumsan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
