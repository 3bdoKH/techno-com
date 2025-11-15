import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    tags: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IGallery>('Gallery', gallerySchema);

