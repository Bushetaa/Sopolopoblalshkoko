"use client";

import { usePathname } from 'next/navigation';

export interface Breadcrumb {
  label: string;
  path?: string;
}

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = usePathname();
  
  if (pathname === '/') {
    return [{ label: 'Platform' }, { label: 'Overview' }];
  }

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [{ label: 'Platform' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format segment: "api-manager" -> "API Manager"
    const label = segment
      .split('-')
      .map(word => {
        if (word.toLowerCase() === 'api') return 'API';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    breadcrumbs.push({
      label,
      path: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
