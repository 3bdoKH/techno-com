"use client"
import { useState, useEffect, useCallback } from 'react'
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

interface Value {
    title: string;
    description: string;
}

const Values = () => {
    const [section, setSection] = useState<AboutSection | null>(null);
    const [values, setValues] = useState<Value[]>([]);
    const [loading, setLoading] = useState(true);

    const loadValues = useCallback(async () => {
        try {
            const response = await api.getPublicAboutSections('values');
            if (response.success && response.data) {
                const sections = response.data as AboutSection[];
                const valuesSection = sections[0] || null;
                setSection(valuesSection);

                let valuesList: Value[] = [];

                if (valuesSection?.stats && Array.isArray(valuesSection.stats) && valuesSection.stats.length > 0) {
                    valuesList = valuesSection.stats.map(stat => ({
                        title: stat.label,
                        description: stat.value
                    }));
                }

                if (valuesList.length === 0) {
                    valuesList = getFallbackValues();
                }

                setValues(valuesList);
            } else {
                setValues(getFallbackValues());
            }
        } catch (error) {
            console.error('Error loading values section:', error);
            setValues(getFallbackValues());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadValues();
    }, [loadValues]);
    // mock data for values
    const getFallbackValues = (): Value[] => [
        {
            title: 'Integrity',
            description: 'We uphold the highest ethical standards and ensure full compliance with international regulations.',
        },
        {
            title: 'Innovation',
            description: 'We harness cutting-edge technologies to deliver superior defense capabilities.',
        },
        {
            title: 'COMMITMENT',
            description: 'We are dedicated to meeting the evolving needs of our partners with professionalism and precision.',
        },
        {
            title: 'EXCELLENCE',
            description: 'We strive for unmatched quality in every product, service, and collaboration.'
        }
    ];

    const headerText = section?.description || 'At Techno International Group, our work is guided by a set of non-negotiable values that define who we are and how we serve.';

    if (loading) {
        return (
            <section className='flex flex-col py-10 px-6 md:py-20 md:px-16 gap-6 bg-[#F1F2F2]'>
                <div className='animate-pulse'>
                    <div className='h-6 bg-gray-300 rounded w-32 mb-2'></div>
                    <div className='h-20 bg-gray-300 rounded max-w-3xl'></div>
                </div>
                <div className='flex flex-col md:flex-row gap-8 md:gap-16 mt-6'>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='w-full md:w-1/2 border-t-2 border-gray-300 pt-6 animate-pulse'>
                            <div className='h-8 bg-gray-300 rounded w-1/2 mb-4'></div>
                            <div className='h-16 bg-gray-300 rounded'></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className='flex flex-col py-10 px-6 md:py-20 md:px-16 gap-6 bg-[#F1F2F2]'>
            <div>
                <p className='text-lg mb-2 text-[#C3996C] tracking-widest font-base uppercase text-start'>{'//CORE VALUES'}</p>
                <p className='text-sm md:text-2xl leading-relaxed font-base max-w-3xl'>
                    {headerText}
                </p>
            </div>
            <div className='flex flex-col md:flex-row gap-8 md:gap-16 mt-6'>
                {values.map((value, index) => (
                    <div key={`${value.title}-${index}`} className='w-full md:w-1/2 border-t-2 border-gray-300 pt-6'>
                        <div className='flex flex-col items-start gap-4'>
                            <h2 className='text-xl uppercase font-semibold leading-tight'>{value.title}</h2>
                            <p className='text-sm md:text-base leading-relaxed'>{value.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Values
