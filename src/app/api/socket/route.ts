import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'http';
import { initSocketServer } from '@/lib/socket-server';

// Create HTTP server
const httpServer = createServer();

// Initialize Socket.IO server
const io = initSocketServer(httpServer);

// Start the server on a specific port
const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

// This route handler is just a placeholder to keep the API route valid
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Socket.IO server is running' });
}