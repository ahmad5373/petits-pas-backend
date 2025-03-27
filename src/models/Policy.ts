import mongoose, { Schema, Document } from "mongoose";


interface IPolicy extends Document {
    type: 'terms' | 'privacy';
    content? : string;
    updatedAt: Date; 
}

const policySchema = new Schema<IPolicy> (
    {
        type: {type: String, default: 'terms',  enum: ['terms', 'privacy'],},
        content: {type: String},
        updatedAt: {type: Date, default: Date.now},
    },
)
export const Policy = mongoose.model<IPolicy>("Policy", policySchema);

