import { Button } from '@rumsan/shadcn';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh bg-background">
      <div className="flex flex-col items-center justify-center gap-4 p-8 border rounded-lg bg-card">
        <h1 className="text-2xl font-bold text-foreground">
          Rumsan Component Library
        </h1>
        <Button size="sm">Button from main export</Button>
        <p className="text-sm text-muted-foreground">
          This button is imported from the main package entry point.
        </p>

        {/* Demo Links */}
        <div className="flex flex-col gap-2 mt-6">
          <h2 className="text-lg font-semibold text-center">Demos</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/demo/alert-system">
              <Button variant="outline" size="sm">
                Alert System
              </Button>
            </Link>
            <Link href="/demo/shadcn">
              <Button variant="outline" size="sm">
                Shadcn Components
              </Button>
            </Link>
            <Link href="/demo/rumsan-ui">
              <Button variant="outline" size="sm">
                Rumsan UI
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm">Toggle theme:</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
