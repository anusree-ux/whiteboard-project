import React, { useEffect, useState } from 'react';
import { socket } from "./socket";

// Hardcode a test room ID for now
const TEST_ROOM_ID = 'test-room-123';

function App() {

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // When socket connects
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected successfully!');

      // Join our test room
      socket.emit('joinRoom', TEST_ROOM_ID);
  });

  // When socket disconnects
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected.');
    });

    // Manually connect the socket
    socket.connect();

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/*Header*/}
      <header className="text-3xl font-bold mb-8 text-indigo-700">
        Collaborative Whiteboard
      </header>
      {/*Placeholder of canvas Area*/}
      <main className="w-full max-w-4xl h-96 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white shadow-xl">
        <p className="text-gray-500 text-lg">
          Canvas Area Placeholder - (ready for drawing logic)
        </p>
      </main>

      {/* Footer/Status */}
      <footer className="mt-8 text-sm">
        Status:{' '}
        <span className={`font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? `Connected (Room: ${TEST_ROOM_ID})` : 'Disconnected'}
        </span>
      </footer>
    </div>
  );
}

export default App
