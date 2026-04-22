# Quickstart: Layout System

This document explains how to set up and integrate the Layout System framework.

> **Project structure note**: There is no `src/` folder. Components live in `/components/`, hooks in `/hooks/`, and the dashboard layout entry point is `app/(dashboard)/layout.tsx` (a Next.js route group separate from the marketing `app/layout.tsx`).

## 1. Implement Components

1. Create `components/dashboard/Sidebar.tsx` consuming the `MENU_SECTIONS` config from `data-model.md`.
2. Create `components/layout/CommandPalette.tsx` and wire a `Cmd+K` / `Ctrl+K` `keydown` listener via `useEffect` in `app/(dashboard)/layout.tsx`.
3. Create `components/dashboard/Header.tsx` and place it above `{children}` in the dashboard layout.

## 2. Wrap the Application

Create `app/(dashboard)/layout.tsx` as the **dashboard-only** layout shell. The existing `app/layout.tsx` (marketing Navbar + Footer) remains untouched.

```tsx
// app/(dashboard)/layout.tsx
'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { useLayout } from '@/hooks/useLayout';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobileSidebarOpen, openMobileSidebar, closeMobileSidebar } = useLayout();
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-50 overflow-hidden">
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden lg:flex w-64 flex-shrink-0 border-r border-gray-800">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMobileMenuOpen={openMobileSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## 3. Key Import Aliases

The project uses `@/` as the root alias (defined in `tsconfig.json`):

```typescript
// ✅ Correct
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useLayout } from '@/hooks/useLayout';

// ❌ Wrong (no src/ folder exists)
import { Sidebar } from '@/src/app/components/dashboard/Sidebar';
```
