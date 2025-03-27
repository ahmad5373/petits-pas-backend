import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    profileImage?: string;
    email: string;
    phone?: string;
    password: string;
    role: 'user' | 'admin';
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        profileImage: { type: String },
        phone: { type: String },
        password: { type: String, required: true },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
