'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rumsan/shadcn/components/card';
import { Badge } from '@rumsan/shadcn/components/badge';
import { Button } from '@rumsan/shadcn/components/button';
import {
  ArrowRight,
  Calendar,
  DollarSign,
  AlertTriangle,
  Package,
} from 'lucide-react';

const demos = [
  {
    title: 'Alert Components',
    description:
      'Modal alert dialogs with different variants and provider pattern support',
    path: '/demo/rumsan-ui/alert',
    icon: AlertTriangle,
    badge: '@rumsan/ui',
    features: [
      'Provider pattern',
      'Direct components',
      'Multiple variants',
      'Customizable',
    ],
  },
  {
    title: 'Currency Amount Field',
    description:
      'Interactive currency and amount input field component with form integration',
    path: '/demo/rumsan-ui/currency-amount-field',
    icon: DollarSign,
    badge: '@rumsan/ui',
    features: [
      'Form controlled',
      'Standalone usage',
      'Multiple currencies',
      'Validation',
    ],
  },
  {
    title: 'Date Selector Field',
    description:
      'Date picker component with calendar popover and form integration',
    path: '/demo/rumsan-ui/date-selector-field',
    icon: Calendar,
    badge: '@rumsan/ui',
    features: [
      'Date picker',
      'Inactive dates',
      'Form integration',
      'Customizable',
    ],
  },
  {
    title: 'Shadcn UI Components',
    description:
      'Test page showcasing shadcn/ui components with individual and bulk imports',
    path: '/demo/shadcn',
    icon: Package,
    badge: '@rumsan/shadcn',
    features: [
      'Individual imports',
      'Bulk imports',
      'Tree shaking',
      'Utilities',
    ],
  },
];

export default function RumsanUIDemos() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Rumsan UI Components</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive demos showcasing the components from the @rumsan/ui
          library. Explore form controls, data inputs, and UI elements built
          with React and shadcn/ui.
        </p>
        <Badge variant="secondary" className="text-sm">
          @rumsan/ui
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card
            key={demo.path}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <demo.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline">{demo.badge}</Badge>
                </div>
              </div>
              <CardTitle className="text-xl">{demo.title}</CardTitle>
              <CardDescription className="text-base">
                {demo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {demo.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button asChild className="w-full group-hover:bg-primary/90">
                <Link href={demo.path}>
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-semibold">More Coming Soon</h2>
        <p className="text-muted-foreground">
          We're continuously adding new component demos. Check back for updates!
        </p>
      </div>
    </div>
  );
}
