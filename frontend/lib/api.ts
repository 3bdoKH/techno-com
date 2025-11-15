const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tashteeb-beltaqseet.com/api';
interface HeroData {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText?: string;
    ctaLink?: string;
}

interface AboutSectionData {
    title: string;
    section: string;
    description: string;
}

interface EventData {
    title: string;
    description: string;
    date: string;
    location: string;
    images: string[];
    category: string;
}

interface GalleryItemData {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string[];
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<{ success: boolean; data?: T; message?: string; errors?: Record<string, string> }> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error('API Error:', errorMessage);
            throw new Error(errorMessage);
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string, name: string) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateProfile(name: string, email: string) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, email }),
        });
    }

    async changePassword(currentPassword: string, newPassword: string) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    // Hero endpoints
    async getActiveHero() {
        const url = `${this.baseURL}/hero/active`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch active hero');
        }
        return data;
    }

    async getHeroes() {
        return this.request('/hero');
    }

    async getHero(id: string) {
        return this.request(`/hero/${id}`);
    }

    async createHero(data: HeroData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await fetch(`${this.baseURL}/hero`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create hero');
            }
            return result;
        }
        return this.request('/hero', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateHero(id: string, data: HeroData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await fetch(`${this.baseURL}/hero/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update hero');
            }
            return result;
        }
        return this.request(`/hero/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteHero(id: string) {
        return this.request(`/hero/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleHeroActive(id: string) {
        return this.request(`/hero/${id}/toggle-active`, {
            method: 'PATCH',
        });
    }

    // About endpoints
    async getAboutSections(section?: string) {
        const query = section ? `?section=${section}` : '';
        return this.request(`/about${query}`);
    }

    // Public about endpoint (no auth required)
    async getPublicAboutSections(section?: string) {
        const query = section ? `?section=${section}` : '';
        const url = `${this.baseURL}/about/public${query}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch about sections');
        }
        return data;
    }

    async getAboutSection(id: string) {
        return this.request(`/about/${id}`);
    }

    async createAboutSection(data: AboutSectionData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No authentication token found');
            const response = await fetch(`${this.baseURL}/about`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                const errorMessage = result.errors
                    ? `Validation error: ${result.errors.map((e: { msg?: string }) => e.msg || '').join(', ')}`
                    : result.message || 'Failed to create about section';
                throw new Error(errorMessage);
            }
            return result;
        }
        return this.request('/about', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateAboutSection(id: string, data: AboutSectionData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No authentication token found');
            const response = await fetch(`${this.baseURL}/about/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                const errorMessage = result.errors
                    ? `Validation error: ${result.errors.map((e: { msg?: string }) => e.msg || '').join(', ')}`
                    : result.message || 'Failed to update about section';
                throw new Error(errorMessage);
            }
            return result;
        }
        return this.request(`/about/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteAboutSection(id: string) {
        return this.request(`/about/${id}`, {
            method: 'DELETE',
        });
    }

    // Events endpoints
    async getEvents(filters?: { category?: string; featured?: boolean }) {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.featured !== undefined) params.append('featured', String(filters.featured));

        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/events${query}`);
    }

    async getEvent(id: string) {
        return this.request(`/events/${id}`);
    }

    async createEvent(data: EventData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No authentication token found');
            const response = await fetch(`${this.baseURL}/events`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to create event');
            return result;
        }
        return this.request('/events', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateEvent(id: string, data: EventData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No authentication token found');
            const response = await fetch(`${this.baseURL}/events/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update event');
            return result;
        }
        return this.request(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteEvent(id: string) {
        return this.request(`/events/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleEventFeatured(id: string) {
        return this.request(`/events/${id}/toggle-featured`, {
            method: 'PATCH',
        });
    }

    // Gallery endpoints
    async getGalleryItems(category?: string) {
        const query = category ? `?category=${category}` : '';
        return this.request(`/gallery${query}`);
    }

    async getGalleryItem(id: string) {
        return this.request(`/gallery/${id}`);
    }

    async createGalleryItem(data: GalleryItemData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No authentication token found');
            const response = await fetch(`${this.baseURL}/gallery`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to create gallery item');
            return result;
        }
        return this.request('/gallery', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateGalleryItem(id: string, data: GalleryItemData | FormData) {
        if (data instanceof FormData) {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No authentication token found');
            const response = await fetch(`${this.baseURL}/gallery/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update gallery item');
            return result;
        }
        return this.request(`/gallery/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteGalleryItem(id: string) {
        return this.request(`/gallery/${id}`, {
            method: 'DELETE',
        });
    }

}

export const api = new ApiClient(API_BASE_URL);

