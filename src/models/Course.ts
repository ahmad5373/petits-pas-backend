import mongoose, { Schema, Document } from "mongoose";
interface IVideo {
    title: string;
    videoUrl: string;
    documentUrl: string;
}

interface IWeekContent {
    thumbnail: string;
    category: string;
    videos: IVideo[];
}

interface IContentItem {
    title: string;
    videoUrl: string;
    thumbnail: string;
    context: string;
    documentUrl: string;
    weeklyContent: Record<string, IWeekContent>; // Object with week keys
}

interface ICourse extends Document {
    title: string;
    image: string;
    introduction: string;
    content: IContentItem[];
    status: 'inActive' | 'active';
    isComplete: boolean;
}

const videoSchema = new Schema({
    title: { type: String },
    videoUrl: { type: String },
    documentUrl: { type: String }
}, { _id: false });

const weekContentSchema = new Schema({
    thumbnail: { type: String },
    category: { type: String },
    videos: [videoSchema]
}, { _id: false });

const courseSchema = new Schema<ICourse>({
    title: { type: String , required: true},
    image: { type: String , required: true},
    introduction: { type: String , required: true},
    content: [
        {
            title: { type: String},
            thumbnail: { type: String },
            videoUrl: { type: String },
            context: { type: String },
            documentUrl: { type: String },
            weeklyContent: {
                type: Map,
                of: weekContentSchema,
                default: {}
            }
        }
    ],
    status: { 
        type: String, 
        default: 'active', 
        enum: ['active', 'inActive'] 
    },
    isComplete: { type: Boolean, default: false }
}, { timestamps: true });

export const Course = mongoose.model<ICourse>("Course", courseSchema);