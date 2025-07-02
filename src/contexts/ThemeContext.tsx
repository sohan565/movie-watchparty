'use client';

import { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

type CustomThemeProviderProps = {
  children: ReactNode;
  [key: string]: any;
};

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

// Re-export the useTheme hook from next-themes
export const useTheme = useNextTheme;