import mongoose, { Document, Schema, Types } from "mongoose";


interface IReview extends Document {
    user: Types.ObjectId;
    reviewFor: Types.ObjectId;
    rating: number;
    comment?: string;
}

const reviewSchema = new Schema<IReview> (
    {
        user: {type: Schema.Types.ObjectId, ref: "User", required: true},
        reviewFor: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: {type: Number, required:true, min:1, max:5},
        comment: {type: String},
    },
    {timestamps: true}
)
export const Review = mongoose.model<IReview>("Review", reviewSchema);
