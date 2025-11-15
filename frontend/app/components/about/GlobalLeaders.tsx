"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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

const GlobalLeaders = () => {
    const [section, setSection] = useState<AboutSection | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSection();
    }, []);

    const loadSection = async () => {
        try {
            const response = await api.getPublicAboutSections('global-leaders');
            if (response.success && response.data) {
                const sections = response.data as AboutSection[];
                setSection(sections[0] || null);
            }
            console.log(response.data)
        } catch (error) {
            console.error('Error loading global leaders section:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/api/uploads/')) {
            return `${process.env.NEXT_PUBLIC_UPLOADS_URL}${imageUrl}`;
        }
        return imageUrl;
    };

    const fallbackTitle = 'GLOBAL LEADERS IN DEFENSE & SECURITY SOLUTIONS';
    const fallbackSubtitle = 'Techno International Group stands as a premier provider of defense and security solutions, committed to strengthening national security and advancing operational readiness worldwide. We deliver more than products — we deliver confidence, resilience, and innovation that empower nations to protect their sovereighty and citizens.';
    const fallbackDescription = 'With decades of experience and a robust presence across 30+ countries, our operations are supported by a global network of over 4,000 defense and security experts. From military equipment and advanced technologies to strategic consulting and training, we offer mission-ready solutions tailored to the unique needs of armed forces, law enforcement agencies, and government institutions.';
    const fallbackImage = '/flag-2.png';

    if (loading) {
        return (
            <div className='min-h-screen bg-[url("../public/about-2.png")] bg-cover bg-center relative flex flex-col gap-10 px-10 py-12 md:px-26 md:pt-20 md:pb-40 justify-between'>
                <div className='w-full max-w-4xl animate-pulse'>
                    <div className='h-12 bg-gray-300 rounded mb-4'></div>
                    <div className='h-6 bg-gray-300 rounded w-3/4'></div>
                </div>
            </div>
        );
    }

    const displayTitle = section?.title || fallbackTitle;
    const displaySubtitle = section?.subtitle || section?.description || fallbackSubtitle;
    const displayDescription = section?.description && section?.subtitle ? section.description : (!section ? fallbackDescription : '');
    const displayImage = section?.images && section.images.length > 0
        ? formatImageUrl(section.images[0])
        : fallbackImage;

    return (
        <div className='min-h-screen bg-[url("../public/about-2.png")] bg-cover bg-center relative flex flex-col gap-10 px-10 py-12 md:px-26 md:pt-20 md:pb-40 justify-between '>
            <div className='w-full max-w-4xl'>
                <h2 className='text-3xl md:max-w-2xl md:text-4xl font-bold leading-tight transform md:scale-y-150 md:mb-8'>
                    {displayTitle}
                </h2>
                <p className='text-base md:text-lg font-bold my-4 md:my-6 md:max-w-xl'>
                    {displaySubtitle}
                </p>
            </div>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
                <div className='w-full lg:w-1/2'>
                    {displayImage && (
                        <div className='w-full h-auto relative'>
                            <div
                                className='w-full h-[400px] md:h-[500px] bg-cover bg-center'
                                style={{ backgroundImage: `url(${displayImage})` }}
                            />
                        </div>
                    )}
                </div>
                <div className='w-full lg:w-1/2 flex flex-col'>
                    {displayDescription && (
                        <p className='text-sm md:text-xl leading-relaxed'>
                            {displayDescription}
                        </p>
                    )}

                    <Button variant="outline" className="text-white text-xs md:text-sm font-semibold max-w-xs bg-black mt-6 border-gray-700 rounded-none">
                        DOWNLOAD COMPANY PROFILE
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default GlobalLeaders
