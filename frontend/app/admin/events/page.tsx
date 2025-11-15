'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
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

export default function EventsManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        images: [''],
        category: 'conference',
        isActive: true,
        featured: false,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const response = await api.getEvents();
            if (response.success && response.data) {
                setEvents(response.data as Event[]);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', formData.date);
            data.append('location', formData.location);
            data.append('category', formData.category);
            data.append('isActive', String(formData.isActive));
            data.append('featured', String(formData.featured));

            imageFiles.forEach(file => {
                data.append('images', file);
            });

            if (editingEvent) {
                await api.updateEvent(editingEvent._id, data);
            } else {
                await api.createEvent(data);
            }

            loadEvents();
            resetForm();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            location: event.location,
            images: event.images.length > 0 ? event.images : [''],
            category: event.category,
            isActive: event.isActive,
            featured: event.featured,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await api.deleteEvent(id);
            loadEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const handleToggleFeatured = async (id: string) => {
        try {
            await api.toggleEventFeatured(id);
            loadEvents();
        } catch (error) {
            console.error('Error toggling featured status:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            location: '',
            images: [''],
            category: 'conference',
            isActive: true,
            featured: false,
        });
        setImageFiles([]);
        setEditingEvent(null);
        setShowForm(false);
    };

    const categories = ['airshow', 'exhibition', 'conference', 'trade-show', 'other'];

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="space-y-6 bg-gray-900">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Events</h1>
                            <p className="mt-2 text-white">Manage events and conferences</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {showForm ? 'Cancel' : '+ Add Event'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
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
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Images
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
                                    {editingEvent && editingEvent.images.length > 0 && imageFiles.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Current: {editingEvent.images.length} image(s)
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-6">
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

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                                            Featured
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        {editingEvent ? 'Update Event' : 'Create Event'}
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
                    ) : events.length === 0 ? (
                        <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                            <p className="text-gray-500">No events found. Create your first event!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {events.map((event) => (
                                <div key={event._id} className="bg-white p-6 rounded-sm shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                                                {event.featured && (
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                        Featured
                                                    </span>
                                                )}
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${event.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {event.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {new Date(event.date).toLocaleDateString()}   •    {event.location}   •
                                                {event.category}
                                            </p>
                                            <p className="text-gray-600">{event.description}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleFeatured(event._id)}
                                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                                            >
                                                ⭐
                                            </button>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event._id)}
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

