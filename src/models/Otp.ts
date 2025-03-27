import mongoose, { Schema, Document, Types } from "mongoose";

interface iOTP extends Document {
    user : Types.ObjectId;
    otp?: string;
    expiresAt: Date
};

const otpSchema = new Schema<iOTP>({
    user: {
        type : Schema.Types.ObjectId,
        ref: 'UserBase',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: 
    {
        type: Date ,
        required: true
    }
} ,{timestamps: true});

otpSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});
const OTP = mongoose.model<iOTP>('OTP' , otpSchema);

export default OTP
