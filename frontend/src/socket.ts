// frontend/src/socket.ts
import { io, Socket } from 'socket.io-client';

// Define the type for the socket object
export interface ClientToServerEvents {
    joinRoom: (roomId: string) => void;
    drawingAction: (data: any, roomId: string) => void;
}

export interface ServerToClientEvents {
    drawingAction: (data: any) => void;
    // We can add events like 'userJoined', 'userLeft' later
}

// Connect to the backend Socket.io server
const SOCKET_SERVER_URL = 'http://localhost:3001';

// Create a singleton instance of the socket connection
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_SERVER_URL, {
    autoConnect: false, // We'll manage connection manually
});