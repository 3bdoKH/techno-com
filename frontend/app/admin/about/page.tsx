'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';

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

export default function AboutManagement() {
    const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        section: 'mission',
        description: '',
        isActive: true,
        order: 0,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [stats, setStats] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        loadAboutSections();
    }, []);

    const loadAboutSections = async () => {
        try {
            const response = await api.getAboutSections();
            if (response.success && response.data) {
                setAboutSections(response.data as AboutSection[]);
            }
        } catch (error) {
            console.error('Error loading about sections:', error);
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
            data.append('section', formData.section);
            data.append('description', formData.description);
            data.append('isActive', String(formData.isActive));
            data.append('order', String(formData.order));

            if (stats.length > 0) {
                data.append('stats', JSON.stringify(stats));
            }

            imageFiles.forEach(file => {
                data.append('images', file);
            });

            if (editingSection) {
                await api.updateAboutSection(editingSection._id, data);
            } else {
                await api.createAboutSection(data);
            }

            loadAboutSections();
            resetForm();
        } catch (error) {
            console.error('Error saving about section:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save about section';
            alert(errorMessage);
        }
    };

    const handleEdit = (section: AboutSection) => {
        setEditingSection(section);
        setFormData({
            title: section.title,
            subtitle: section.subtitle || '',
            section: section.section,
            description: section.description,
            isActive: section.isActive,
            order: section.order,
        });
        setStats(section.stats || []);
        setImageFiles([]);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section?')) return;

        try {
            await api.deleteAboutSection(id);
            loadAboutSections();
        } catch (error) {
            console.error('Error deleting section:', error);
            alert('Failed to delete section');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            section: 'mission',
            description: '',
            isActive: true,
            order: 0,
        });
        setImageFiles([]);
        setStats([]);
        setEditingSection(null);
        setShowForm(false);
    };

    const addStat = () => {
        setStats([...stats, { label: '', value: '' }]);
    };

    const removeStat = (index: number) => {
        setStats(stats.filter((_, i) => i !== index));
    };

    const updateStat = (index: number, field: 'label' | 'value', value: string) => {
        const newStats = [...stats];
        newStats[index][field] = value;
        setStats(newStats);
    };

    const sections = ['mission', 'vision', 'values', 'quality', 'global-leaders', 'clients'];

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="space-y-6 bg-gray-900">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">About Sections</h1>
                            <p className="mt-2 text-white">Manage about page sections</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {showForm ? 'Cancel' : '+ Add Section'}
                        </button>
                    </div>
                    {showForm && (
                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingSection ? 'Edit About Section' : 'Create New About Section'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Section Type *
                                        </label>
                                        <select
                                            required
                                            value={formData.section}
                                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {sections.map((sec) => (
                                                <option key={sec} value={sec}>
                                                    {sec.charAt(0).toUpperCase() + sec.slice(1).replace(/-/g, ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

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
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Images
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {imageFiles.length > 0 && (
                                        <p className="text-sm text-green-600 mt-1">
                                            {imageFiles.length} file(s) selected
                                        </p>
                                    )}
                                    {editingSection && editingSection.images && editingSection.images.length > 0 && !imageFiles.length && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Current: {editingSection.images.length} image(s)
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stats
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addStat}
                                            className="text-sm text-indigo-600 hover:text-indigo-700"
                                        >
                                            + Add Stat
                                        </button>
                                    </div>
                                    {stats.map((stat, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Label"
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={stat.value}
                                                onChange={(e) => updateStat(index, 'value', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeStat(index)}
                                                className="px-3 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
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
                                        {editingSection ? 'Update Section' : 'Create Section'}
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
                    ) : aboutSections.length === 0 ? (
                        <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                            <p className="text-gray-500">No sections found. Create your first section!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {aboutSections.map((section) => (
                                <div key={section._id} className="bg-white p-6 rounded-sm shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                                                <span className={`px-2 py-1 text-xs rounded ${section.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {section.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-indigo-600 mb-1">
                                                {section.section.charAt(0).toUpperCase() + section.section.slice(1).replace(/-/g, ' ')} • Order: {section.order}
                                            </p>
                                            {section.subtitle && (
                                                <p className="text-sm font-medium text-gray-700 mb-2">{section.subtitle}</p>
                                            )}
                                            <p className="text-gray-600 mb-3">{section.description}</p>

                                            {section.images && section.images.length > 0 && (
                                                <div className="flex gap-2 mb-3">
                                                    {section.images.slice(0, 3).map((img, idx) => (
                                                        <div key={idx} className="w-20 h-20 relative rounded overflow-hidden bg-gray-200">
                                                            <div key={idx} className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000'}${img})` }}></div>
                                                        </div>
                                                    ))}
                                                    {section.images.length > 3 && (
                                                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500">
                                                            +{section.images.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(section)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(section._id)}
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

