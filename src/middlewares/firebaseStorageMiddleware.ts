import { FirebaseStorage, getStorage } from "firebase/storage";
import firebaseConfig from "../config/firebase";
import { NextFunction, Request, Response } from "express";
declare global {
  namespace Express {
    export interface Request {
      storage: FirebaseStorage;
    }
  }
}
const firebaseStorageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.storage = getStorage(firebaseConfig);
  next();
};

export default firebaseStorageMiddleware;
