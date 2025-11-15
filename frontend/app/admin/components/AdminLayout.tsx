'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [adminUser, setAdminUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('adminUser');
            return user ? JSON.parse(user) : null;
        }
        return null;
    });

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Hero Sections', href: '/admin/hero' },
        { name: 'About Sections', href: '/admin/about' },
        { name: 'Events', href: '/admin/events' },
        { name: 'Gallery', href: '/admin/gallery' },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-64 bg-gray-900 border-r border-gray-200`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className="mb-8 px-3">
                        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                        {adminUser && (
                            <p className="text-sm text-white mt-1">{adminUser.email}</p>
                        )}
                    </div>

                    <ul className="space-y-2 font-medium">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center p-3 rounded-sm transition-colors ${pathname === item.href
                                        ? 'bg-white text-black'
                                        : 'text-white hover:bg-gray-100 hover:text-black'
                                        }`}
                                >
                                    <span className="flex-1">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="absolute bottom-4 left-0 right-0 px-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="sm:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-white rounded-lg shadow-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
                <main className="p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

