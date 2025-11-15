'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';

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

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'events',
    tags: '',
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      const response = await api.getGalleryItems();
      if (response.success && response.data) {
        setGalleryItems(response.data as GalleryItem[]);
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
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
      data.append('category', formData.category);
      data.append('isActive', String(formData.isActive));
      data.append('order', String(formData.order));
      data.append('tags', formData.tags);

      if (imageFile) {
        data.append('imageUrl', imageFile);
      } else if (!editingItem) {
        data.append('imageUrl', formData.imageUrl);
      }

      if (editingItem) {
        await api.updateGalleryItem(editingItem._id, data);
      } else {
        await api.createGalleryItem(data);
      }

      loadGalleryItems();
      resetForm();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      category: item.category,
      tags: item.tags,
      isActive: item.isActive,
      order: item.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.deleteGalleryItem(id);
      loadGalleryItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'events',
      tags: '',
      isActive: true,
      order: 0,
    });
    setImageFile(null);
    setEditingItem(null);
    setShowForm(false);
  };


  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 bg-gray-900">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Gallery</h1>
              <p className="mt-2 text-white">Manage gallery images</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add Image'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? 'Edit Gallery Item' : 'Create New Gallery Item'}
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
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {!editingItem && '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {editingItem && !imageFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Current: {editingItem.imageUrl}
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
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="event, 2024, dubai"
                    />
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
                    {editingItem ? 'Update Item' : 'Create Item'}
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
          ) : galleryItems.length === 0 ? (
            <div className="bg-white p-12 rounded-sm shadow-sm text-center">
              <p className="text-gray-500">No gallery items found. Create your first item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    {item.imageUrl ? (
                      <div className="w-full h-full bg-cover bg-center" style={{
                        backgroundImage: `url(${(item.imageUrl.startsWith('/uploads/') || item.imageUrl.startsWith('/api/uploads/'))
                          ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${item.imageUrl}`
                          : item.imageUrl})`
                      }}></div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-4xl">🖼️</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                          {item.tags.split(',').map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
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

