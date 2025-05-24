import mongoose, { Schema, Document } from "mongoose";

interface IVideo {
    title: string;
    videoUrl: string; // Vimeo video link
    context: string;
    documentUrl: string;
}

interface ICourse extends Document {
    title: string;
    image: string;
    introduction: string;
    content: IVideo[];
    status: 'inActive' | 'active';
    isComplete: boolean;
}

const courseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    introduction: { type: String, required: true },
    content: [
        {
            title: { type: String, required: true },
            videoUrl: { type: String, required: true },
            context: { type: String },
            documentUrl: { type: String },
        },
    ],
    status: { type: String, default: 'active', enum: ['active', 'inActive'] },
    isComplete: { type: Boolean, default: false }
}, { timestamps: true });

export const Course = mongoose.model<ICourse>("Course", courseSchema);
