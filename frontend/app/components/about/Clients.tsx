"use client"
import { Minus, Plus } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

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

interface Client {
    name: string;
    description: string;
}

const Clients = () => {
    const [active, setActive] = useState<number | null>(0)
    const [headerSection, setHeaderSection] = useState<AboutSection | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const loadClientsData = useCallback(async () => {
        try {
            const response = await api.getPublicAboutSections('clients');
            if (response.success && response.data) {
                const sections = response.data as AboutSection[];

                const header = sections.find(s =>
                    s.title.toLowerCase().includes('clients')
                ) || sections[0] || null;

                setHeaderSection(header);

                let clientsList: Client[] = [];

                if (header?.stats && Array.isArray(header.stats) && header.stats.length > 0) {
                    clientsList = header.stats.map(stat => ({
                        name: stat.label,
                        description: stat.value
                    }));
                } else {
                    const sectionWithStats = sections.find(s => s.stats && s.stats.length > 0);
                    if (sectionWithStats?.stats) {
                        clientsList = sectionWithStats.stats.map(stat => ({
                            name: stat.label,
                            description: stat.value
                        }));
                    }
                }

                if (clientsList.length === 0) {
                    clientsList = getFallbackClients();
                }

                setClients(clientsList);
            } else {
                setClients(getFallbackClients());
            }
        } catch (error) {
            console.error('Error loading clients data:', error);
            setClients(getFallbackClients());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClientsData();
    }, [loadClientsData]);
    // mock data for clients
    const getFallbackClients = (): Client[] => [
        {
            name: 'UK MINISTRY OF DEFENCE',
            description: 'Techno International Group collaborates with the UK Ministry of Defence to deliver cutting-edge defense solutions and strategic capabilities. Our partnership focuses on providing advanced military equipment, technology integration, and comprehensive support services that align with the UK\'s defense priorities and operational requirements.'
        },
        {
            name: 'CÔTE D\'IVOIRE MINISTRY OF DEFENCE',
            description: 'We work closely with the Côte d\'Ivoire Ministry of Defence to strengthen national security infrastructure and enhance defense capabilities. Our solutions include modern military equipment, training programs, and strategic advisory services designed to support the country\'s security objectives and regional stability efforts.'
        },
        {
            name: 'BURKINA FASO MINISTRY OF DEFENCE',
            description: 'Techno International Group supports the Burkina Faso Ministry of Defence in building robust defense capabilities and operational readiness. We provide essential military equipment, specialized training, and technical support to help address security challenges and maintain national sovereignty.'
        },
        {
            name: 'CHAD MINISTRY OF DEFENCE',
            description: 'Our partnership with the Chad Ministry of Defence focuses on enhancing military capabilities and operational effectiveness. We deliver advanced defense systems, comprehensive training programs, and strategic consulting services to support Chad\'s security missions and regional peacekeeping efforts.'
        },
        {
            name: 'JORDAN MINISTRY OF DEFENCE',
            description: 'Techno International Group partners with the Jordan Ministry of Defence to provide sophisticated defense solutions and strategic support. We supply advanced military technologies, equipment, and training services that enhance Jordan\'s defense posture and contribute to regional security and stability.'
        },
        {
            name: 'ZAMBIA MINISTRY OF DEFENCE',
            description: 'We collaborate with the Zambia Ministry of Defence to strengthen national defense capabilities and operational readiness. Our comprehensive solutions include modern military equipment, professional training programs, and technical support services tailored to Zambia\'s unique security requirements.'
        },
        {
            name: 'UGANDA MINISTRY OF DEFENCE',
            description: 'Techno International Group partners with the Uganda Ministry of Defence to enhance national security and regional stability. We provide advanced equipment, strategic consulting, and training programs, ensuring Uganda\'s armed forces remain prepared and mission-ready for evolving challenges.'
        },
        {
            name: 'MALAWI MINISTRY OF DEFENCE',
            description: 'Our partnership with the Malawi Ministry of Defence focuses on building defense capacity and enhancing operational capabilities. We deliver essential military equipment, specialized training, and strategic advisory services to support Malawi\'s national security objectives and regional cooperation efforts.'
        },
        {
            name: 'AZERSILAH MINISTRY OF DEFENCE',
            description: 'Techno International Group works with the Azersilah Ministry of Defence to provide advanced defense solutions and strategic capabilities. We supply cutting-edge military equipment, comprehensive training programs, and technical support services that strengthen national defense and regional security partnerships.'
        },
        {
            name: 'TURKISH MILITARY PRODUCTION MINISTRY',
            description: 'We collaborate with the Turkish Military Production Ministry to support defense manufacturing and technology development initiatives. Our partnership focuses on providing advanced systems, technical expertise, and strategic consulting to enhance Turkey\'s defense industrial capabilities and operational readiness.'
        },
        {
            name: 'GHANA MINISTRY OF DEFENCE',
            description: 'Techno International Group partners with the Ghana Ministry of Defence to enhance military capabilities and national security. We provide modern defense equipment, professional training programs, and strategic advisory services that support Ghana\'s defense modernization efforts and regional peacekeeping contributions.'
        },
        {
            name: 'DEMOCRATIC REPUBLIC OF CONGO MINISTRY OF DEFENCE',
            description: 'Our collaboration with the Democratic Republic of Congo Ministry of Defence focuses on strengthening defense infrastructure and operational effectiveness. We deliver essential military equipment, comprehensive training, and technical support services to enhance the country\'s security capabilities and regional stability.'
        },
        {
            name: 'NIGERIA MINISTRY OF DEFENCE',
            description: 'Techno International Group works closely with the Nigeria Ministry of Defence to provide comprehensive defense solutions and strategic support. We supply advanced military equipment, specialized training programs, and technical advisory services that enhance Nigeria\'s defense capabilities and support regional security initiatives.'
        },
        {
            name: 'NIGER MINISTRY OF DEFENCE',
            description: 'We partner with the Niger Ministry of Defence to strengthen national security and defense capabilities. Our solutions include modern military equipment, professional training, and strategic consulting services designed to support Niger\'s security operations and contribute to regional stability efforts.'
        },
        {
            name: 'SOUTH AFRICA MINISTRY OF DEFENCE',
            description: 'Techno International Group collaborates with the South Africa Ministry of Defence to deliver advanced defense solutions and strategic capabilities. We provide cutting-edge military technologies, comprehensive training programs, and technical support services that enhance South Africa\'s defense posture and regional leadership.'
        },
        {
            name: 'LIBYA MINISTRY OF DEFENCE',
            description: 'Our partnership with the Libya Ministry of Defence focuses on rebuilding defense capabilities and enhancing operational readiness. We deliver essential military equipment, specialized training programs, and strategic advisory services to support Libya\'s security objectives and national stability efforts.'
        },
        {
            name: 'REPUBLIC OF CENTRAL AFRICA MINISTRY OF DEFENCE',
            description: 'Techno International Group works with the Republic of Central Africa Ministry of Defence to strengthen defense infrastructure and operational capabilities. We provide modern military equipment, comprehensive training, and technical support services that enhance national security and contribute to regional peace and stability.'
        },
    ];

    const handleClick = (index: number) => {
        setActive(prev => (prev === index ? null : index))
    }

    const headerTitle = headerSection?.title || 'OUR CLIENTS & PARTNERS';
    const headerDescription = headerSection?.description || 'Partnerships are the cornerstone of our success. We collaborate with governments, ministries of defense, and leading defense manufacturers to strengthen security worldwide.';
    if (loading) {
        return (
            <section className='bg-black text-white px-6 py-16 md:px-16 lg:px-24 relative'>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="container mx-auto h-full relative">
                        <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[20%]"></div>
                        <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[40%]"></div>
                        <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[60%]"></div>
                        <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[80%]"></div>
                    </div>
                </div>
                <div className='max-w-6xl mx-auto flex flex-col gap-12 lg:flex-row lg:items-start relative z-10'>
                    <div className='lg:w-2/5 space-y-6 animate-pulse'>
                        <div className='h-12 bg-gray-700 rounded w-3/4'></div>
                        <div className='h-24 bg-gray-700 rounded'></div>
                    </div>
                    <div className='lg:w-3/5 space-y-4 pt-26'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='border-b border-t border-white/15 animate-pulse'>
                                <div className='h-16 bg-gray-700 rounded'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='bg-black text-white px-6 py-16 md:px-16 lg:px-24 relative'>
            <div className="absolute inset-0 pointer-events-none">
                <div className="container mx-auto h-full relative">
                    <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[20%]"></div>
                    <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[40%]"></div>
                    <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[60%]"></div>
                    <div className="absolute top-0 bottom-0 w-px bg-white/10 left-[80%]"></div>
                </div>
            </div>
            <div className='max-w-6xl mx-auto flex flex-col gap-12 lg:flex-row lg:items-start relative z-10'>
                <div className='lg:w-2/5 space-y-6'>
                    <h1 className='text-3xl md:text-5xl font-semibold leading-tight'>
                        {headerTitle}
                    </h1>
                    <p className='text-sm md:text-xl text-white leading-relaxed'>
                        {headerDescription}
                    </p>
                </div>
                <div className='lg:w-3/5 pt-26 *:border-t'>
                    {clients.map((client, index) => {
                        const isActive = active === index
                        return (
                            <div key={`${client.name}-${index}`} className=' border-white/15'>
                                <button
                                    type='button'
                                    onClick={() => handleClick(index)}
                                    className='w-full flex justify-start items-center gap-6 px-5 py-4 text-left hover:bg-white/5 transition-colors'
                                >
                                    <span className='text-xl md:text-2xl font-light'>
                                        {isActive ? <Minus size={36} strokeWidth={0.5} /> : <Plus size={36} strokeWidth={0.5} />}
                                    </span>
                                    <span className='text-sm md:text-base font-medium tracking-wide uppercase'>
                                        {client.name}
                                    </span>
                                </button>
                                {isActive && (
                                    <div className='p-5 pl-20 text-xs md:text-base text-white/80 leading-relaxed border-white/10'>
                                        {client.description}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Clients
