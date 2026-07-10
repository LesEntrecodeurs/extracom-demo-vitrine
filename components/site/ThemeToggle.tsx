'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="relative grid size-4 place-items-center">
        <Sun
          className={`absolute size-4 transition duration-200 ${
            isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute size-4 transition duration-200 ${
            isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
          aria-hidden="true"
        />
      </span>
      <span className="hidden lg:inline">{isDark ? 'Clair' : 'Sombre'}</span>
    </button>
  );
}
