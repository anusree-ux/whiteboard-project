// frontend/src/App.tsx (Update)
import React, { useEffect, useRef, useState } from 'react';
import { socket } from './socket';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      setIsConnected(true);
      console.log("socket connected successfully");
      socket.emit('joinRoom', 'test-room-123');
    });

    // LISTENER: Receive drawing data from others
    socket.on('drawingAction', (data: any) => {
      drawOnCanvas(data.x, data.y, data.type, false);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log("socket disconnected");
    });

    return () => { socket.disconnect(); };
  }, []);

  const drawOnCanvas = (x: number, y: number, type: 'start' | 'draw', emit: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4f46e5'; // Indigo color

    if (type === 'start') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // If this move was made by ME, send it to the server
    if (emit) {
      socket.emit('drawingAction', { x, y, type }, 'test-room-123');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    drawOnCanvas(offsetX, offsetY, 'start', true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    drawOnCanvas(offsetX, offsetY, 'draw', true);
  };

  const stopDrawing = () => setIsDrawing(false);

 /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        Collaborative Whiteboard
      </h1>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="bg-white border rounded-lg shadow-lg cursor-crosshair"
      />

       <p className="mt-4 text-sm">
        Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </p>
    </div>
  );
}

export default App;