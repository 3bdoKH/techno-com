'use client'
import Image from 'next/image'
import Link from 'next/link'
import { TextAlignJustify, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }
    const pathname = usePathname()
    return (
        <header className='absolute top-0 left-0 w-full z-50 '>
            <div className='container mx-auto px-10 py-8 flex items-center justify-between md:px-40'>
                <div className='flex items-center justify-between'>
                    <Link href='/'>
                        <Image src='/logo.png' alt='logo' width={50} height={50} />
                    </Link>
                </div>
                <nav className={`hidden md:flex`}>
                    <ul className={`flex items-center gap-5 font-extralight text-xs ${pathname === '/about' ? 'text-black' : 'text-gray-300'}`}>
                        <li>
                            <Link href='/about'>ABOUT US</Link>
                        </li>
                        <li className='flex items-center'>
                            <Link href='#solutions'>SOLUTIONS</Link>
                            <TextAlignJustify className='w-4 h-4 ml-1' />
                        </li>
                        <li className='flex items-center'>
                            <Link href='#services'>SERVICES</Link>
                            <TextAlignJustify className='w-4 h-4 ml-1' />
                        </li>
                        <li>
                            <Link href='#manufacturing'>MANUFACTURING</Link>
                        </li>
                        <li>
                            <Link href='#partnerships'>PARTNERSHIPS</Link>
                        </li>
                        <li>
                            <Link href='#media-centre'>MEDIA CENTRE</Link>
                        </li>
                        <li>
                            <Link href='#contact'>CONTACT</Link>
                        </li>
                    </ul>
                </nav>
                <div className={`flex items-center gap-1 font-medium text-gray-300 text-xs`}>
                    <span>EN</span>
                    <span>FR</span>
                </div>
                {
                    isOpen ? (
                        <X className='w-4 h-4 md:hidden cursor-pointer text-white z-10' onClick={toggleMenu} />
                    ) : (
                        <Menu className='w-4 h-4 md:hidden cursor-pointer text-white z-10' onClick={toggleMenu} />
                    )
                }
                <nav className={`${isOpen ? 'flex' : 'hidden'} md:hidden absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center `}>
                    <ul className='flex flex-col items-center gap-15 font-extralight text-gray-300 text-xs h-full justify-center' onClick={toggleMenu}>
                        <li>
                            <Link href='/about'>ABOUT US</Link>
                        </li>
                        <li className='flex items-center'>
                            <Link href='#solutions'>SOLUTIONS</Link>
                            <TextAlignJustify className='w-4 h-4 ml-1' />
                        </li>
                        <li className='flex items-center'>
                            <Link href='#services'>SERVICES</Link>
                            <TextAlignJustify className='w-4 h-4 ml-1' />
                        </li>
                        <li>
                            <Link href='#manufacturing'>MANUFACTURING</Link>
                        </li>
                        <li>
                            <Link href='#partnerships'>PARTNERSHIPS</Link>
                        </li>
                        <li>
                            <Link href='#media-centre'>MEDIA CENTRE</Link>
                        </li>
                        <li>
                            <Link href='#contact'>CONTACT</Link>
                        </li>
                    </ul>
                </nav>
            </div>

        </header>
    )
}

export default Navbar
