import * as dotenv from "dotenv";
import express, { Request,Response} from "express";
import connectDB  from "./config/db";
import authRoutes from "./routes/authRoutes";
import { createServer } from "http";
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables from .env file
dotenv.config();  

//connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

//Auth Routes
app.use("/api/auth",authRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({status:'API running', service:'whiteboard-api'});
});

// Create HTTP server
const httpServer = createServer(app);

//create socket.io server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

//Socket.io events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("drawingAction", (data: any, roomId: string) => {
    // .to(roomId) targets the room
    // .emit sends it to everyone in that room EXCEPT the sender
    socket.to(roomId).emit("drawingAction", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

//start http server(not express)
httpServer.listen(PORT, () => {
  console.log(`🚀 API + Socket Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
