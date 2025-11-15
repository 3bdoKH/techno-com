"use client"
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
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

const Quality = () => {
    const [section, setSection] = useState<AboutSection | null>(null);
    const [loading, setLoading] = useState(true);

    const loadSection = useCallback(async () => {
        try {
            const response = await api.getPublicAboutSections('quality');
            if (response.success && response.data) {
                const sections = response.data as AboutSection[];
                setSection(sections[0] || null);
            }
        } catch (error) {
            console.error('Error loading quality section:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSection();
    }, [loadSection]);

    const formatImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/api/uploads/')) {
            return `${process.env.NEXT_PUBLIC_UPLOADS_URL}${imageUrl}`;
        }
        return imageUrl;
    };

    const title = section?.title || 'COMPLIANCE & QUALITY ASSURANCE';
    const description = section?.description || 'We operate with unwavering transparency and accountability. Amstone International Group strictly adheres to international arms regulations including ITAR, EAR, and UN export control laws.';
    const secondDescription = section?.subtitle || 'Our products and services meet global military standards such as MIL-STD, STANAG, and GOST, ensuring safety, reliability, and operational excellence. Every solution undergoes rigorous quality assurance processes, guaranteeing that our partners receive only the highest level of performance.';
    const qualityImage = section?.images && section.images.length > 0
        ? formatImageUrl(section.images[0])
        : '/quality.png';

    if (loading) {
        return (
            <section className='pt-60 bg-black text-white flex flex-col py-10 px-6 md:py-20 md:pb-30 md:px-20 gap-6'>
                <div className='flex items-start justify-between w-full border-b border-gray-400 pb-10 animate-pulse'>
                    <div className='md:w-1/2'>
                        <div className='h-12 bg-gray-700 rounded w-3/4 mb-4'></div>
                        <div className='h-20 bg-gray-700 rounded'></div>
                    </div>
                    <div className='w-1/2 hidden md:flex items-center justify-end'>
                        <div className='w-32 h-32 bg-gray-700 rounded'></div>
                    </div>
                </div>
                <div className='flex items-start justify-between w-full pt-10 gap-10 flex-col md:flex-row animate-pulse'>
                    <div className='md:w-1/2 h-64 bg-gray-700 rounded'></div>
                    <div className='md:w-1/2'>
                        <div className='h-32 bg-gray-700 rounded mb-4'></div>
                        <div className='h-10 bg-gray-700 rounded w-48'></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='pt-60 bg-black text-white flex flex-col py-10 px-6 md:py-20 md:pb-30 md:px-20 gap-6'>
            <div className='flex items-start justify-between w-full border-b border-gray-400 pb-10'>
                <div className='md:w-1/2'>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl uppercase font-semibold leading-tight'>
                        {title.split('\n').map((line, idx) => (
                            <span key={idx}>
                                {line}
                                {idx < title.split('\n').length - 1 && <br />}
                            </span>
                        ))}
                    </h1>
                    <p className='text-sm md:text-base leading-relaxed mt-4'>
                        {secondDescription}
                    </p>
                </div>
                <div className='w-1/2 hidden md:flex items-center justify-end '>
                    <Image src='/search.png' alt='quality' width={150} height={150} className='' />
                </div>
            </div>
            <div className='flex items-start justify-between w-full pt-10 gap-10 flex-col md:flex-row'>
                <div className='md:w-1/2'>
                    <div
                        className='w-full h-[300px] bg-cover bg-center'
                        style={{ backgroundImage: `url(${qualityImage})` }}
                    />
                </div>
                <div className='md:w-1/2 flex flex-col justify-between h-full relative'>
                    <p className='text-sm md:text-base leading-relaxed'>
                        {description}
                    </p>
                    <Button variant="outline" className="text-white text-xs font-semibold bg-black border-gray-700 rounded-none mt-4 md:mt-40 w-fit">DOWNLOAD COMPANY PROFILE</Button>
                </div>
            </div>
        </section>
    )
}

export default Quality
