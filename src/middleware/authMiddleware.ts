import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utility/apiResponse";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: { user_id: string; role: string };
}

export const authenticateUser =async(req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer JWT_TOKEN"

        if (!token) {
            return sendResponse(res, 401 , 'Unauthorized: No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { user_id: string; role: string };

        req.user = decoded; // Attach user data to the request
        next();
    } catch (error) {
        return sendResponse(res, 401 , 'Unauthorized: Invalid token')
    }
};

export const findUserByEmail = async (email: string) => await User.findOne({ email });
export const findUserByPhone = async (phone:string) => await User.findOne({ phone});
