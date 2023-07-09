import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ id: decoded.id });
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default authenticateToken;
