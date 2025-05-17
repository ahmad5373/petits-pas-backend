import mongoose, { Schema, Document } from "mongoose";

interface IVideoProgress {
  videoId: string;
  completed: boolean;
}

interface ICourseProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  videoProgress: IVideoProgress[];
  isComplete: boolean;
  progress: number;
}

const courseProgressSchema = new Schema<ICourseProgress>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  videoProgress: [
    {
      videoId: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  isComplete: { type: Boolean, default: false },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

export const CourseProgress = mongoose.model<ICourseProgress>('CourseProgress', courseProgressSchema);
