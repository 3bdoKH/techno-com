'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';

interface Hero {
    _id: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText?: string;
    ctaLink?: string;
    isActive: boolean;
}

interface AboutSection {
    _id: string;
    title: string;
    section: string;
    description: string;
}

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

interface GalleryItem {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string[];
    isActive: boolean;
    order: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        heroes: 0,
        about: 0,
        events: 0,
        gallery: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [heroesRes, aboutRes, eventsRes, galleryRes] = await Promise.all([
                api.getHeroes(),
                api.getAboutSections(),
                api.getEvents(),
                api.getGalleryItems(),
            ]);

            setStats({
                heroes: (heroesRes.data as Hero[])?.length || 0,
                about: (aboutRes.data as AboutSection[])?.length || 0,
                events: (eventsRes.data as Event[])?.length || 0,
                gallery: (galleryRes.data as GalleryItem[])?.length || 0,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { name: 'Hero Sections', value: stats.heroes, link: '/admin/hero' },
        { name: 'About Sections', value: stats.about, link: '/admin/about' },
        { name: 'Events', value: stats.events, link: '/admin/events' },
        { name: 'Gallery Items', value: stats.gallery, link: '/admin/gallery' },
    ];

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="space-y-8 bg-gray-900">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="mt-2 text-white">Welcome to the admin dashboard</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statCards.map((card) => (
                                <a
                                    key={card.name}
                                    href={card.link}
                                    className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <h3 className="text-gray-600 text-sm font-medium">{card.name}</h3>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="bg-white rounded-sm shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <a
                                href="/admin/hero"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Add Hero Section</p>
                                    <p className="text-sm text-gray-500">Create new hero</p>
                                </div>
                            </a>

                            <a
                                href="/admin/events"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Add Event</p>
                                    <p className="text-sm text-gray-500">Create new event</p>
                                </div>
                            </a>

                            <a
                                href="/admin/gallery"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Add Gallery Item</p>
                                    <p className="text-sm text-gray-500">Upload new image</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}

