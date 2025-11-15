import { Button } from '@/components/ui/button'
import React from 'react'

const Footer = () => {
  return (
    <footer className='pt-26 pb-16 bg-black relative'>
      <div className='w-full bg-[url("../public/footer.png")] bg-cover bg-center h-[300px]'></div>
      <div className="absolute w-full h-full inset-0 flex flex-col items-center justify-center">
        <p className='text-gray-500 text-center text-lg font-bold mb-4'>
          Contact
        </p>
        <h2 className='text-white text-center text-2xl font-light mb-12'>
          LET’S SHAPE THE FUTURE <br />
          OF DEFENSE TOGETHER.
        </h2>
        <p className='text-gray-300 text-center text-sm mb-6'>
          info@technoig.com
        </p>
        <p className='text-gray-300 text-center text-sm'>
          Offices in Egypt, UAE, Hungary, South Africa, Central Africa
        </p>
        <p className='text-gray-300 text-center text-sm mb-4'>
          +207 29801663
        </p>
        <Button variant="outline" className="text-white text-sm md:text-xs font-semibold max-w-xl bg-black mt-6 border-gray-700 rounded-none w-fit">GET IN TOUCH</Button>
      </div>
    </footer>
  )
}

export default Footer
