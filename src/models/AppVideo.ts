import mongoose, { Schema, Document } from "mongoose";

// interface IVideo {
//     title: string;
//     videoUrl: string; // Vimeo video link
// }

interface IAppVideo extends Document {
    title: string;
    thumbnail: string;
    videoUrl: string;
    status: 'inActive' | 'active';
    category: mongoose.Types.ObjectId; // Reference to Category
}

const courseSchema = new Schema<IAppVideo>({
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    status: { type: String, default: 'active',  enum: ['active', 'inActive']},
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true},
}, {timestamps: true});

export const AppVideos = mongoose.model<IAppVideo>("AppVideos", courseSchema);
