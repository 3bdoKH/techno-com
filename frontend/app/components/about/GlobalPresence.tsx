import { ArrowUpRight } from 'lucide-react'
import React from 'react'

const GlobalPresence = () => {
    return (
        <section className='md:grid md:grid-cols-10 h-[500px] felx flex-col'>
            <div className='h-[150px] md:h-full col-span-2 bg-[url("../public/pattern-2.png")] bg-cover bg-center relative'>
                <p className='absolute top-18 w-full text-center text-white text-xl font-base'>GLOBAL PRESENCE</p>
            </div>
            <div className='col-span-1 h-full p-0 relative hidden md:block'>
                <ArrowUpRight size={256} strokeWidth={0.6} className='absolute bottom-[-30px] left-[-50%]' />
            </div>
            <div className='col-span-7 h-full bg-[url("../public/presence.png")] bg-cover bg-center relative'>
            </div>
        </section>
    )
}

export default GlobalPresence
