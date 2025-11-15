"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    images: string[];
    category: string;
    isActive: boolean;
    featured: boolean;
}

const IndustryEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const response = await api.getPublicEvents();
            if (response.success && response.data) {
                const allEvents = response.data as Event[];
                const sortedEvents = allEvents
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const featured = sortedEvents.find(event => event.featured) || null;
                setFeaturedEvent(featured);

                const listEvents = featured
                    ? sortedEvents.filter(event => event._id !== featured._id)
                    : sortedEvents;

                setEvents(listEvents);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLogo = (event: Event) => {
        const titleLower = event.title.toLowerCase();
        if (titleLower.includes('edex')) {
            return '/edex.png';
        }
        if (titleLower.includes('airshow')) {
            return '/airshow.png';
        }
        return '/edex.png';
    };

    const formatImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/api/uploads/')) {
            return `${process.env.NEXT_PUBLIC_UPLOADS_URL || 'https://tashteeb-beltaqseet.com'}${imageUrl}`;
        }
        return imageUrl;
    };


    const eventsData = events.map(event => ({
        year: new Date(event.date).getFullYear().toString(),
        title: event.title,
        description: event.description,
        logoSrc: getLogo(event),
        logoAlt: `${event.title} Logo`,
        images: event.images.slice(0, 2).map((img, idx) => ({
            src: formatImageUrl(img),
            alt: `${event.title} - Image ${idx + 1}`,
        })),
        linkText: `VISIT ${event.title.toUpperCase()}`,
        linkHref: '#',
    }));

    if (loading) {
        return (
            <section className="bg-white flex flex-col items-center justify-between py-16 px-8 lg:px-32 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="container mx-auto h-full relative">
                        <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[20%]"></div>
                        <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[40%]"></div>
                        <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[60%]"></div>
                        <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[80%]"></div>
                    </div>
                </div>
                <div className="container mx-auto relative z-10">
                    <div className="animate-pulse space-y-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex flex-col lg:flex-row justify-between gap-8 py-16">
                                <div className="flex-1 lg:max-w-md space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                    <div className="h-20 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <div className="h-[200px] bg-gray-200 rounded"></div>
                                    <div className="h-[200px] bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="bg-white flex flex-col items-center justify-between py-16 px-8 lg:px-32 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="container mx-auto h-full relative">
                    <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[20%]"></div>
                    <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[40%]"></div>
                    <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[60%]"></div>
                    <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[80%]"></div>
                </div>
            </div>
            <div className="container mx-auto flex flex-col justify-between border-b-2 pb-16 border-gray-300 relative z-10">
                <p className="text-xs uppercase tracking-widest font-light text-amber-500">
                    {"// MEDIACENTER"}
                </p>
                <p className="text-sm uppercase tracking-widest font-light mb-4">
                    Industry Events
                </p>
                <p className="text-lg lg:max-w-2xl">
                    At Techno International Group, we believe that leadership in defense
                    and security extends beyond delivering equipment and expertise — it&apos;s
                    about being at the heart of global conversations that shape the future
                    of defense. That&apos;s why we actively participate in the world&apos;s most
                    influential defense exhibitions and summits, where we showcase our
                    latest innovations, build strategic partnerships, and exchange
                    knowledge with international leaders.
                </p>
            </div>

            {eventsData.length > 0 && (
                <div className="container mx-auto overflow-auto border-b-2 pb-16 border-gray-300 relative z-10">
                    {eventsData.map((event, index) => (
                        <div
                            key={events.length > 0 ? events[index]?._id || index : index}
                            className="flex flex-col lg:flex-row justify-between gap-8 py-16 overflow-auto"
                        >
                            <div className="flex-1 lg:max-w-md">
                                <p className="text-xs uppercase tracking-widest font-light mb-2">
                                    {event.title} - {event.year}
                                </p>
                                <p className="text-sm mb-2 text-gray-500">{event.description}</p>
                                {event.logoSrc && (
                                    <Image
                                        src={event.logoSrc}
                                        alt={event.logoAlt}
                                        width={100}
                                        height={100}
                                        className=" mb-8 text-center py-4"
                                    />
                                )}
                                <a
                                    href={event.linkHref}
                                    className="text-xs uppercase tracking-widest font-light"
                                >
                                    {event.linkText}
                                </a>
                            </div>

                            {event.images.length > 0 && (
                                <div className="flex-1 grid grid-cols-2 gap-2 lg:gap-2 overflow-auto">
                                    {event.images.map((image, imgIndex) => (
                                        image.src && (
                                            <div key={imgIndex} className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image.src})` }}></div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {featuredEvent && (
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-12 py-16 relative z-10">

                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <Image
                                src={getLogo(featuredEvent)}
                                alt={`${featuredEvent.title} Logo`}
                                width={100}
                                height={100}
                                className=" text-gray-500 text-center py-10"
                            />
                            <div>
                                <p className="text-xs uppercase tracking-widest font-light text-amber-500">
                                    LEADING THE FUTURE OF DEFENSE
                                </p>
                                <h2 className="text-4xl lg:text-5xl font-bold my-3 text-gray-900">
                                    {featuredEvent.title.toUpperCase()}.
                                </h2>
                            </div>
                        </div>
                        <p className="text-xl mb-6 lg:max-w-2xl">
                            {featuredEvent.description}
                        </p>
                        {featuredEvent.location && (
                            <a
                                href="#"
                                className="text-sm uppercase tracking-widest font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                {featuredEvent.location.toUpperCase()}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default IndustryEvents;