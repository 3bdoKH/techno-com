"use client"
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'

interface AboutSection {
    _id: string;
    title: string;
    section: string;
    subtitle?: string;
    description: string;
    content?: Record<string, unknown>;
    images?: string[];
    stats?: {
        label: string;
        value: string;
    }[];
    isActive: boolean;
    order: number;
}

const MissionAndVision = () => {
    const [mission, setMission] = useState<AboutSection | null>(null);
    const [vision, setVision] = useState<AboutSection | null>(null);
    const [loading, setLoading] = useState(true);

    const loadSections = useCallback(async () => {
        try {
            const [missionResponse, visionResponse] = await Promise.all([
                api.getPublicAboutSections('mission'),
                api.getPublicAboutSections('vision')
            ]);

            if (missionResponse.success && missionResponse.data) {
                const missionSections = missionResponse.data as AboutSection[];
                setMission(missionSections[0] || null);
            }

            if (visionResponse.success && visionResponse.data) {
                const visionSections = visionResponse.data as AboutSection[];
                setVision(visionSections[0] || null);
            }
        } catch (error) {
            console.error('Error loading mission and vision sections:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSections();
    }, [loadSections]);

    const formatImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/api/uploads/')) {
            return `${process.env.NEXT_PUBLIC_UPLOADS_URL}${imageUrl}`;
        }
        return imageUrl;
    };

    const missionTitle = mission?.title || 'Our Mission';
    const missionDescription = mission?.description || 'To reinforce national defense capabilities by delivering state-of-the-art military equipment, innovative security solutions, and expert consultancy services that safeguard nations and support mission success.';
    const missionImage = mission?.images && mission.images.length > 0
        ? formatImageUrl(mission.images[0])
        : '/mission.png';
    const visionTitle = vision?.title || 'Our Vision';
    const visionDescription = vision?.description || 'To be recognized as the world\'s most trusted defense partner, providing advanced solutions that empower military and law enforcement agencies, while driving global stability and security.';
    const visionImage = vision?.images && vision.images.length > 0
        ? formatImageUrl(vision.images[0])
        : '/vision.png';

    if (loading) {
        return (
            <section className='flex flex-col'>
                <div className='flex flex-col-reverse md:flex-row animate-pulse'>
                    <div className='w-full md:w-1/2 flex flex-col justify-between gap-6 px-6 py-10 md:px-10 lg:px-16 lg:py-14'>
                        <div className='h-10 bg-gray-200 rounded w-1/2'></div>
                        <div className='h-32 bg-gray-200 rounded'></div>
                    </div>
                    <div className='w-full md:w-1/2 h-64 sm:h-80 md:h-[500px] bg-gray-200'></div>
                </div>
                <div className='flex flex-col md:flex-row animate-pulse'>
                    <div className='w-full md:w-1/2 h-64 sm:h-80 md:h-[500px] bg-gray-200'></div>
                    <div className='w-full md:w-1/2 flex flex-col justify-between gap-6 px-6 py-10 md:px-10 lg:px-16 lg:py-14'>
                        <div className='h-10 bg-gray-200 rounded w-1/2'></div>
                        <div className='h-32 bg-gray-200 rounded'></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='flex flex-col'>
            <div className='flex flex-col-reverse md:flex-row'>
                <div className='w-full md:w-1/2 flex flex-col justify-between gap-6 px-6 py-10 md:px-10 lg:px-16 lg:py-14'>
                    <div className='flex flex-col items-start gap-4'>
                        <h2 className='text-2xl md:text-3xl lg:text-4xl uppercase font-semibold leading-tight'>{missionTitle}</h2>
                        <Image src='/search.png' alt='mission icon' width={60} height={60} className='hidden sm:block' />
                    </div>
                    <p className='text-sm md:text-base lg:text-lg font-medium md:font-semibold leading-relaxed text-black/80'>
                        {missionDescription}
                    </p>
                </div>
                <div className='w-full md:w-1/2 h-64 sm:h-80 md:h-[500px] relative'>
                    <div
                        className='w-full h-full bg-cover bg-center'
                        style={{ backgroundImage: `url(${missionImage})` }}
                    />
                </div>
            </div>
            <div className='flex flex-col md:flex-row'>
                <div className='w-full md:w-1/2 h-64 sm:h-80 md:h-[500px] relative'>
                    <div
                        className='w-full h-full bg-cover bg-center'
                        style={{ backgroundImage: `url(${visionImage})` }}
                    />
                </div>
                <div className='w-full md:w-1/2 flex flex-col justify-between gap-6 px-6 py-10 md:px-10 lg:px-16 lg:py-14'>
                    <div className='flex flex-col items-start gap-4'>
                        <h2 className='text-2xl md:text-3xl lg:text-4xl uppercase font-semibold leading-tight'>{visionTitle}</h2>
                        <Image src='/search.png' alt='vision icon' width={60} height={60} className='hidden sm:block' />
                    </div>
                    <p className='text-sm md:text-base lg:text-lg font-medium md:font-semibold leading-relaxed text-black/80'>
                        {visionDescription}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default MissionAndVision
