import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedCompany {
  id: number;
  email: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      company?: {
        id: number;
        email?: string;
        [key: string]: any;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid Authorization header." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token is missing." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedCompany;
    req.company = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error: ", error);
    res.status(401).json({ message: "Invalid or expired token." });
    return;
  }
};
