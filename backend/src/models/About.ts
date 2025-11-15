import mongoose, { Document, Schema } from 'mongoose';

export interface IAbout extends Document {
    section: string;
    title: string;
    subtitle?: string;
    description: string;
    content?: any;
    images?: string[];
    stats?: {
        label: string;
        value: string;
    }[];
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const aboutSchema = new Schema<IAbout>(
    {
        section: {
            type: String,
            required: true,
            enum: ['mission', 'vision', 'values', 'quality', 'global-leaders', 'clients'],
        },
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: Schema.Types.Mixed,
        },
        images: [{
            type: String,
        }],
        stats: [{
            label: String,
            value: String,
        }],
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

export default mongoose.model<IAbout>('About', aboutSchema);

