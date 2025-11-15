import mongoose, { Document, Schema } from 'mongoose';

export interface IHero extends Document {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroSchema = new Schema<IHero>(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    ctaText: {
      type: String,
    },
    ctaLink: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHero>('Hero', heroSchema);

