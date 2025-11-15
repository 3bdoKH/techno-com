import GlobalLeaders from '../components/about/GlobalLeaders'
import Clients from '../components/about/Clients'
import MissionAndVision from '../components/about/MissionAndVision'
import Values from '../components/about/Values'
import GlobalPresence from '../components/about/GlobalPresence'
import Quality from '../components/about/Quality'

const page = () => {
    return (
        <>
            <div className='h-screen bg-[url("../public/about.png")] bg-cover bg-center relative'>
                <div className='absolute top-0 left-0 w-full h-full bg-black opacity-20'></div>
                <p className='absolute bottom-10 left-40 text-amber-400 fonts-bold'>{'//ABOUT US'}</p>
            </div>
            <GlobalLeaders />
            <Clients />
            <MissionAndVision />
            <Values />
            <GlobalPresence />
            <Quality />
        </>
    )
}

export default page
