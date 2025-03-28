import mongoose, { Schema, Document } from "mongoose";

interface IVideo {
    title: string;
    videoUrl: string; // Vimeo video link
}

interface ICourse extends Document {
    title: string;
    image: string;
    introduction: string;
    content: IVideo[];
    status: 'pending' | 'active' | 'completed';
    category: mongoose.Types.ObjectId; // Reference to Category
}

const courseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    introduction: { type: String, required: true },
    content: [
        {
            title: { type: String, required: true },
            videoUrl: { type: String, required: true },
        },
    ],
    status: { type: String, default: 'pending',  enum: ['pending', 'active', 'completed'],},
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

export const Course = mongoose.model<ICourse>("Course", courseSchema);
