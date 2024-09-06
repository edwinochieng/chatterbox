import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route to test the server
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express and Nodemon!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
