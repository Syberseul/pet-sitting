import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const authenticate = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization;
  if (token != `Bearer ${token}`)
    return res.status(401).json({ error: "Unauthorized" });

  next();
};

interface Pet {
  id: number;
  name: string;
  type: "cat" | "dog";
}

let pets: Pet[] = [{ id: 1, name: "Fluffy", type: "cat" }];

app.get("/", authenticate, (req: Request, res: Response) => {
  req;
  res.json(pets);
});

export default app;
