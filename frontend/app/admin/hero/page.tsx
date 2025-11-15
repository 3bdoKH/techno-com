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

export default function HeroManagement() {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingHero, setEditingHero] = useState<Hero | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        backgroundImage: '',
        ctaText: '',
        ctaLink: '',
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        loadHeroes();
    }, []);

    const loadHeroes = async () => {
        try {
            const response = await api.getHeroes();
            if (response.success && response.data) {
                setHeroes(response.data as Hero[]);
            }
            console.log(response.data)
        } catch (error) {
            console.error('Error loading heroes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('ctaText', formData.ctaText);
            data.append('ctaLink', formData.ctaLink);
            data.append('isActive', String(formData.isActive));
            console.log(data)
            if (imageFile) {
                data.append('backgroundImage', imageFile);
            } else if (!editingHero) {
                data.append('backgroundImage', formData.backgroundImage);
            }

            if (editingHero) {
                await api.updateHero(editingHero._id, data);
            } else {
                await api.createHero(data);
            }

            loadHeroes();
            resetForm();
        } catch (error) {
            console.error('Error saving hero:', error);
            alert('Failed to save hero');
        }
    };

    const handleEdit = (hero: Hero) => {
        setEditingHero(hero);
        setFormData({
            title: hero.title,
            subtitle: hero.subtitle,
            backgroundImage: hero.backgroundImage,
            ctaText: hero.ctaText || '',
            ctaLink: hero.ctaLink || '',
            isActive: hero.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero?')) return;

        try {
            await api.deleteHero(id);
            loadHeroes();
        } catch (error) {
            console.error('Error deleting hero:', error);
            alert('Failed to delete hero');
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await api.toggleHeroActive(id);
            loadHeroes();
        } catch (error) {
            console.error('Error toggling hero status:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            backgroundImage: '',
            ctaText: '',
            ctaLink: '',
            isActive: true,
        });
        setImageFile(null);
        setEditingHero(null);
        setShowForm(false);
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="space-y-6 bg-gray-900">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Hero Sections</h1>
                            <p className="mt-2 text-white">Manage homepage hero sections</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {showForm ? 'Cancel' : '+ Add Hero'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingHero ? 'Edit Hero' : 'Create New Hero'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Subtitle *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Background Image {!editingHero && '*'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {editingHero && !imageFile && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Current: {editingHero.backgroundImage}
                                        </p>
                                    )}
                                    {imageFile && (
                                        <p className="text-sm text-green-600 mt-1">
                                            Selected: {imageFile.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CTA Button Text
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ctaText}
                                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CTA Button Link
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ctaLink}
                                            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        {editingHero ? 'Update Hero' : 'Create Hero'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        </div>
                    ) : heroes.length === 0 ? (
                        <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                            <p className="text-gray-500">No heroes found. Create your first hero section!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {heroes.map((hero) => (
                                <div key={hero._id} className="bg-white p-6 rounded-sm shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{hero.title}</h3>
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${hero.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {hero.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">{hero.subtitle}</p>
                                            {hero.ctaText && (
                                                <p className="text-sm text-indigo-600 mt-2">CTA: {hero.ctaText}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleActive(hero._id)}
                                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                                            >
                                                Toggle
                                            </button>
                                            <button
                                                onClick={() => handleEdit(hero)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(hero._id)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}

