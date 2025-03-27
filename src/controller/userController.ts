import { Request, Response } from "express";
import { User } from "../models/User";
import { sendResponse } from "../utility/apiResponse";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OTP from "../models/Otp";
import { sendMail } from "../middleware/sendMail";
import { findUserByEmail, findUserByPhone } from "../middleware/authMiddleware";

const hashPassword = async (password: string) => await bcrypt.hash(password, 10);

const createJWT = (user_id: any, role: string) => {
    const token = jwt.sign({ user_id: user_id, role: role }, `${process.env.JWT_SECRET}`);
    return token;
}

interface AuthRequest extends Request {
    user?: { user_id: string; role: string };
}

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { role, email, password, phone, name } = req.body;
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return sendResponse(res, 409, "Email already in use");
        }
        const checkRole = role === 'admin' ? 'admin' : 'user'
        const profileImage = req.body.profileImage ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLr3E1_fYG3nqJDD6c13tNJJJ4i8GHLNU7mDLmEjogbLWjjOGDSntFWLgnkAwzR_3UCI8&usqp=CAU'
        const hashedPassword = await hashPassword(password);
        const registeredUser = await User.create({ email, password: hashedPassword, name, phone, profileImage, role: checkRole, });
        const { password: _, ...userWithoutPassword } = registeredUser.toObject();
        const userObj = {
            ...userWithoutPassword,
            access_token: createJWT(registeredUser?._id, registeredUser?.role)
        }
        return sendResponse(res, 201, "User Created Successfully", [], { user: userObj });
    } catch (error: any) {
        console.error("Error in register User:", error);
        return sendResponse(res, 500, `user registeration failed: ${error.message}`);
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            return sendResponse(res, 404, "user not found");
        }
        if (!await bcrypt.compare(password, existingUser.password)) {
            return sendResponse(res, 401, "Invalid credentials");
        }
        const { password: _, ...userWithoutPassword } = existingUser.toObject();
        const userobj = {
            ...userWithoutPassword,
            access_token: createJWT(existingUser?._id, existingUser?.role)
        }
        return sendResponse(res, 200, "Login Successful", [], { user: userobj });
    } catch (error: any) {
        return sendResponse(res, 500, `Error during login: ${error?.message}`);
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 5;
        const type = req.query.type as string || 'user';
        const name = req.query.name as string || '';

        const query: { [key: string]: any } = {};
        if (type) query["role"] = { $regex: type, $options: "i" }   // Case-insensitive search
        if (name) query["name"] = { $regex: name, $options: "i" }   // Case-insensitive search

        const totalResults = await User.countDocuments(query);
        const searchResults = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalResults / limit),
            pageSize: limit,
            totalResults,
        };

        return sendResponse(res, 200, "Users fetched successfully", [], { pagination, results: searchResults });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return sendResponse(res, 500, `Error fetching users: ${error.message}`);
    }
};

export const getSingleUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }
        return sendResponse(res, 200, "user details fetch successfully.", [], user);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching users: ${error.message}`);
    }
}

export const updateUser = async (req: AuthRequest, res: Response): Promise<any> => {
    // const { userId } = req.params;
    try {
        const userId = req?.user?.user_id;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return sendResponse(res, 404, "User not found");
        }       
         const updatedUser = await User.findByIdAndUpdate( userId, req.body, { new: true, runValidators: true });
        return sendResponse(res, 200, "User updated successfully", [], updatedUser);
    } catch (error: any) {
        return sendResponse(res, 500, `Error while updating user: ${error.message}`);
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }
        await User.deleteOne({ _id: userId });
        return sendResponse(res, 200, "User deleted successfully");
    } catch (error: any) {
        return sendResponse(res, 500, `Error deleting user: ${error.message}`);
    }
}

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const requestPasswordReset = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    try {

        const user = await findUserByEmail(email);
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        const otp = generateOTP();
        console.log('generated OTP :>> ', otp);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)


        await OTP.create({ user: user._id, otp, expiresAt: expiresAt })

        const html = `<!DOCTYPE html>
        <html>
        <body>
        <center><img src="http://3.16.10.119/assets/admin/img/logo.png" height="100"></center>
        <center><h1 style="color:#3D6EE0">Password Reset OTP Code</h1></center>
        <br>
        <center><h2>'Your OTP for password reset is: ${otp}. It is valid for 10 minutes.'</h2></center>
        </body>
        </html>`;

        //Compose email 
        const subject = "Password Reset OTP";

        await sendMail(user.email, subject, html);
        return sendResponse(res, 200, "Password Reset Request sent successfully");
    } catch (error: any) {
        console.error("Error while processing forgot password request:", error.message);
        return sendResponse(res, 500, `${error.message}`);
    }
}

export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
    const { email, otp } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return sendResponse(res, 404, "user not found");
        }
        const otpRecords = await OTP.findOne({ user: user?._id, otp });
        if (!otpRecords) {
            return sendResponse(res, 404, "Invalid OTP");
        }
        if (new Date() > otpRecords.expiresAt) {
            await OTP.deleteOne({ _id: otpRecords._id })
            return sendResponse(res, 400, "OTP has expired");
        }
        await OTP.deleteOne({ _id: otpRecords._id })
        return sendResponse(res, 200, "OTP varified successfully.")
    } catch (error: any) {
        return sendResponse(res, 500, `Error verifying OTP: ${error.message}`);
    }
}


export const resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, newPassword } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            return sendResponse(res, 404, "user not found");
        };
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        return sendResponse(res, 200, "Password reset successfully");
    } catch (error: any) {
        return sendResponse(res, 500, `Error resetting password: ${error.message}`);
    }
}