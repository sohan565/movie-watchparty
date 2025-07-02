import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

type VideoState = {
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackRate: number;
};

type Participant = {
  id: string;
  displayName: string;
  isHost: boolean;
  status: 'connected' | 'buffering' | 'paused';
};

type Room = {
  id: string;
  videoUrl: string;
  videoHash: string;
  hostId: string;
  participants: Map<string, Participant>;
  videoState: VideoState;
  createdAt: number;
};

const rooms = new Map<string, Room>();

export function initSocketServer(server: NetServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? false 
        : ['http://localhost:3000'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const displayName = socket.handshake.auth.displayName || 'Anonymous';
    
    if (!userId) {
      return next(new Error('Authentication error'));
    }
    
    socket.data.userId = userId;
    socket.data.displayName = displayName;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Create a new room
    socket.on('room:create', ({ videoUrl, videoHash }, callback) => {
      try {
        const roomId = uuidv4().substring(0, 8);
        const userId = socket.data.userId;
        const displayName = socket.data.displayName;

        const participant: Participant = {
          id: userId,
          displayName,
          isHost: true,
          status: 'connected',
        };

        const participants = new Map<string, Participant>();
        participants.set(userId, participant);

        const room: Room = {
          id: roomId,
          videoUrl,
          videoHash,
          hostId: userId,
          participants,
          videoState: {
            isPlaying: false,
            progress: 0,
            duration: 0,
            playbackRate: 1,
          },
          createdAt: Date.now(),
        };

        rooms.set(roomId, room);
        socket.join(roomId);

        callback({ success: true, roomId });

        // Notify the host they've joined
        socket.emit('room:joined', {
          roomId,
          videoUrl,
          videoHash,
          participants: Array.from(participants.values()),
          isHost: true,
          videoState: room.videoState,
        });
      } catch (error) {
        console.error('Error creating room:', error);
        callback({ success: false, error: 'Failed to create room' });
      }
    });

    // Join an existing room
    socket.on('room:join', ({ roomId }, callback) => {
      try {
        const room = rooms.get(roomId);
        if (!room) {
          return callback({ success: false, error: 'Room not found' });
        }

        const userId = socket.data.userId;
        const displayName = socket.data.displayName;

        const participant: Participant = {
          id: userId,
          displayName,
          isHost: false,
          status: 'connected',
        };

        room.participants.set(userId, participant);
        socket.join(roomId);

        callback({ success: true });

        // Notify the user they've joined
        socket.emit('room:joined', {
          roomId,
          videoUrl: room.videoUrl,
          videoHash: room.videoHash,
          participants: Array.from(room.participants.values()),
          isHost: userId === room.hostId,
          videoState: room.videoState,
        });

        // Notify other participants
        socket.to(roomId).emit('room:participant_joined', participant);
      } catch (error) {
        console.error('Error joining room:', error);
        callback({ success: false, error: 'Failed to join room' });
      }
    });

    // Leave a room
    socket.on('room:leave', ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const userId = socket.data.userId;
      room.participants.delete(userId);

      socket.leave(roomId);

      // Notify other participants
      socket.to(roomId).emit('room:participant_left', userId);

      // If the host left, assign a new host or close the room
      if (userId === room.hostId) {
        if (room.participants.size > 0) {
          // Assign the first participant as the new host
          const newHostId = room.participants.keys().next().value as string;
          const newHost = room.participants.get(newHostId);
          if (newHost) {
            room.hostId = newHostId;
            newHost.isHost = true;
            io.to(roomId).emit('room:host_changed', { newHostId });
          }
        } else {
          // Close the room if no participants left
          rooms.delete(roomId);
        }
      }
    });

    // Update participant status
    socket.on('room:update_status', ({ roomId, status }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const userId = socket.data.userId;
      const participant = room.participants.get(userId);
      if (!participant) return;

      participant.status = status;
      socket.to(roomId).emit('room:participant_status_changed', {
        participantId: userId,
        status,
      });
    });

    // Update video state
    socket.on('video:update_state', ({ roomId, ...state }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const userId = socket.data.userId;
      
      // Only the host can control playback, or anyone if there's no host
      if (userId === room.hostId || !room.hostId) {
        room.videoState = { ...room.videoState, ...state };
        socket.to(roomId).emit('video:state_update', state);
      }
    });

    // Send chat message
    socket.on('chat:send_message', ({ roomId, text }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const userId = socket.data.userId;
      const displayName = socket.data.displayName;

      const message = {
        id: uuidv4(),
        senderId: userId,
        senderName: displayName,
        text,
        timestamp: Date.now(),
      };

      io.to(roomId).emit('chat:message', message);
    });

    // Host controls: kick participant
    socket.on('control:kick', ({ roomId, participantId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const userId = socket.data.userId;
      if (userId !== room.hostId) return; // Only host can kick

      const participantSocketId = getSocketIdByUserId(io, participantId);
      if (participantSocketId) {
        io.to(participantSocketId).emit('control:kicked');
      }

      room.participants.delete(participantId);
      io.to(roomId).emit('room:participant_left', participantId);
    });

    // Host controls: mute participant
    socket.on('control:mute', ({ roomId, participantId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const userId = socket.data.userId;
      if (userId !== room.hostId) return; // Only host can mute

      const participantSocketId = getSocketIdByUserId(io, participantId);
      if (participantSocketId) {
        io.to(participantSocketId).emit('control:muted');
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      console.log(`User disconnected: ${userId}`);

      // Remove user from all rooms they were in
      rooms.forEach((room, roomId) => {
        if (room.participants.has(userId)) {
          room.participants.delete(userId);
          socket.to(roomId).emit('room:participant_left', userId);

          // If the host left, assign a new host or close the room
          if (userId === room.hostId) {
            if (room.participants.size > 0) {
              // Assign the first participant as the new host
              const newHostId = room.participants.keys().next().value as string;
              const newHost = room.participants.get(newHostId);
              if (newHost) {
                room.hostId = newHostId;
                newHost.isHost = true;
                io.to(roomId).emit('room:host_changed', { newHostId });
              }
            } else {
              // Close the room if no participants left
              rooms.delete(roomId);
            }
          }
        }
      });
    });
  });

  return io;
}

// Helper function to get socket ID by user ID
function getSocketIdByUserId(io: SocketIOServer, userId: string): string | undefined {
  let targetSocketId: string | undefined;
  
  io.sockets.sockets.forEach((socket) => {
    if (socket.data.userId === userId) {
      targetSocketId = socket.id;
    }
  });
  
  return targetSocketId;
}