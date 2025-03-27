import mongoose, { Schema, Document } from "mongoose";

export interface IContactUs extends Document {
    name?: string;
    email: string;
    message: string;
}

const ContactUsSchema = new Schema<IContactUs>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

export const ContactUs = mongoose.model<IContactUs>('ContactUs', ContactUsSchema);
