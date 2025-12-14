import * as dotenv from "dotenv";
import express, { Request,Response} from "express";

// Load environment variables from .env file
dotenv.config();  

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({status:'API running', service:'whiteboard-api'});
});

app.listen(PORT, () => {
  console.log(`🚀 API Server is running on port ${PORT}`);
    console.log(`Access health check at http://localhost:${PORT}/health`);
});
