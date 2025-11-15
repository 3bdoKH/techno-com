'use client';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { api } from '@/lib/api';
interface HeroData {
    _id: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText?: string;
    ctaLink?: string;
    isActive: boolean;
}

const Hero = () => {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveHero();
    }, []);

    const fetchActiveHero = async () => {
        try {
            const response = await api.getHeroes();
            if (response.success && Array.isArray(response.data)) {
                const active = response.data.find((hero: HeroData) => hero.isActive);
                if (active) {
                    setHeroData(active as HeroData);
                }
            }
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching hero:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const title = heroData?.title || "GLOBAL LEADERS IN\nDEFENSE & SECURITY SOLUTIONS";
    const backgroundImage = heroData?.backgroundImage || '/hero.png';
    const ctaText = heroData?.ctaText || "Explore";
    const ctaLink = heroData?.ctaLink || "#";


    return (
        <div
            className="bg-cover h-screen flex items-center justify-center relative"
            style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_UPLOADS_URL}${backgroundImage}')` }}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-black/50 to-transparent"></div>
            <div className="container mx-auto pl-10 pr-10 py-8 items-center justify-center flex-col md:pl-40 relative z-10">
                <h1 className="text-white text-4xl font-semibold  max-w-2xl transform md:scale-y-150">
                    {title}
                </h1>
                <p className="text-white text-xl font-semibold max-w-lg mt-4 md:mt-6">
                    {heroData?.subtitle}
                </p>
                {ctaText && (
                    <Link href={ctaLink}>
                        <Button
                            variant="outline"
                            className="text-white text-sm font-semibold max-w-xl bg-black mt-6 border-black rounded-none hover:bg-white hover:text-black transition-colors"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Hero;
