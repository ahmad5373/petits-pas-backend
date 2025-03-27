import mongoose, { Document, Schema } from "mongoose";

export interface IUserBase extends Document {
    name?: string;
    profileImage?: string;
    email: string;
    phone?: string;
    password: string;
    gender?: string;
}

const AdminSchema = new Schema<IUserBase>({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    profileImage: { type: String },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    gender: {type: String},

}, { timestamps: true });

export const Admin = mongoose.model<IUserBase>('Admin', AdminSchema);

