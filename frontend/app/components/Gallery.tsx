"use client"
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface GalleryItem {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    tags: string;
    isActive: boolean;
    order: number;
}

const Gallery = () => {
    const [active, setActive] = useState(1);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGalleryItems();
    }, []);

    const loadGalleryItems = async () => {
        try {
            const response = await api.getPublicGalleryItems();
            if (response.success && response.data) {
                const activeItems = (response.data as GalleryItem[])
                    .sort((a, b) => a.order - b.order)
                    .slice(0, 3);
                setGalleryItems(activeItems);
            }
        } catch (error) {
            console.error('Error loading gallery items:', error);
        } finally {
            setLoading(false);
        }
    };

    // mock data if there is no data from the API
    const fallbackCards = [
        {
            title: "SOLUTIONS",
            subtitle: "PROVEN POWER. BATTLE-TESTED SOLUTIONS.",
            desc: "From concept to execution, our solutions are engineered to perform under pressure. We integrate innovation, strategy, and field-tested reliability to deliver results that withstand real-world challenges. Every system, every process, every outcome — built to achieve mission success.",
            img: "/solution.png",
            tags: "AIR, LAND, SEA",
        },
        {
            title: "MANUFACTURING",
            subtitle: "BUILT FROM PRECISION. FORGED FOR PERFORMANCE.",
            desc: "Techno Logistics ensures that every mission moves without hesitation. Through seamless coordination, global reach, and military-grade efficiency, we deliver equipment, maintenance, and support — wherever the mission demands. From the factory floor to the frontline, we make readiness a constant.",
            img: "/manufacturing.png",
            tags: "AIR, LAND, SEA",
        },
        {
            title: "LOGISTICS",
            subtitle: "ENGINEERED FOR UNINTERRUPTED SUPPLY.",
            desc: "We specialize in keeping operations moving — without delay, disruption, or downtime. Our logistics framework is designed for agility and resilience, ensuring continuous flow from origin to destination. Precision tracking, rapid deployment, and adaptive support keep every supply line strong and responsive.",
            img: "/logistics.png",
            tags: "AIR, LAND, SEA",
        },
    ];

    // formats
    const cards = galleryItems.length > 0
        ? galleryItems.map(item => ({
            title: item.title.toUpperCase(),
            subtitle: item.category.toUpperCase() || item.title.toUpperCase(),
            desc: item.description || `${item.title} - ${item.category}`,
            img: (item.imageUrl.startsWith('/uploads/') || item.imageUrl.startsWith('/api/uploads/'))
                ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${item.imageUrl}`
                : item.imageUrl,
            tags: item.tags || '',
        }))
        : fallbackCards;

    if (loading) {
        return (
            <section className="flex flex-col lg:flex-row h-auto lg:h-[90vh] w-full overflow-hidden text-white">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-800 relative flex-1 min-h-[60vh] lg:min-h-0 animate-pulse"
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                ))}
            </section>
        );
    }

    return (
        <section className="flex flex-col lg:flex-row h-auto lg:h-screen w-full overflow-hidden text-white">
            {cards.map((card, i) => (
                <div
                    key={galleryItems.length > 0 ? galleryItems[i]?._id || i : i}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(1)}
                    onClick={() => setActive(active === i ? 1 : i)}
                    style={{ backgroundImage: `url(${card.img})` }}
                    className={`bg-cover bg-center relative flex-1 min-h-[60vh] lg:min-h-0 transition-all duration-700 ease-in-out cursor-pointer ${active === i ? "lg:flex-2 brightness-110" : "brightness-50"} hover:brightness-110`}>
                    <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setActive(active === i ? 1 : i)} />
                    <div className="absolute top-0 left-0 z-10 space-y-2 w-full p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between h-full">
                        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest border-b w-full pb-3 sm:pb-4">
                            {card.title}
                        </h2>
                        {
                            active !== i && (
                                <>
                                    <p
                                        className={`text-base sm:text-lg lg:text-xl max-w-xs transition-all duration-500 y-0 translate-y-5"`}
                                    >
                                        {card.subtitle}
                                    </p>
                                    {card.tags && (
                                        <div className="flex items-center gap-2 border w-fit px-2 py-1 [&>*:not(:last-child)]:border-r">
                                            {card.tags.split(',').map((tag: string, index: number) => (
                                                <span key={index} className="text-[10px] border-white px-2 py-1">{tag.trim().toUpperCase()}</span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )
                        }
                        <div>
                            {card.tags && (
                                <div className={`flex items-center gap-2 border w-fit px-2 py-1 [&>*:not(:last-child)]:border-r ${active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                                    {card.tags.split(',').map((tag: string, index: number) => (
                                        <span key={index} className="text-[10px] border-white px-2 py-1">{tag.trim().toUpperCase()}</span>
                                    ))}
                                </div>
                            )}
                            <p
                                className={`mt-2 text-base sm:text-lg lg:text-xl max-w-xs transition-all duration-500 ${active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                                    }`}
                            >
                                {card.subtitle}
                            </p>
                            <p
                                className={`text-xs sm:text-sm max-w-xs mt-2 sm:mt-3 transition-all duration-500 ${active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                                    }`}
                            >
                                {card.desc}
                            </p>
                            <button
                                className={`border-white py-1 text-xl uppercase tracking-widest mt-2 sm:mt-3 transition ${active === i ? "opacity-100" : "opacity-0"} flex items-center gap-2`}>
                                Explore <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Gallery;