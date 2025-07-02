'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { RoomProvider } from '@/contexts/RoomContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SocketProvider>
          <RoomProvider>
            {children}
          </RoomProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}