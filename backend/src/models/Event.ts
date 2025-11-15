import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    images: string[];
    category: string;
    isActive: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        images: [{
            type: String,
        }],
        category: {
            type: String,
            required: true,
            enum: ['airshow', 'exhibition', 'conference', 'trade-show', 'other'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IEvent>('Event', eventSchema);

