import mongoose, { Schema, Document } from "mongoose";

interface IFaqs extends Document {
    question: string;
    answer: string;
    
}
const faqsSchema = new Schema<IFaqs>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, {timestamps: true});

export const Faqs = mongoose.model<IFaqs>("Faqs", faqsSchema);
