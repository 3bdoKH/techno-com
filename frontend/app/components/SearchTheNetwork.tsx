import Image from "next/image"

const SearchTheNetwork = () => {

    return (
        <section className="bg-[url('../public/pattern-2.png')] bg-cover bg-center text-white flex items-center justify-center  p-8 lg:min-h-[500px]">
            <div className="container mx-auto flex flex-col justify-between gap-16 lg:gap-24 w-full h-full lg:min-h-[400px]">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2 lg:max-w-[40%]">
                        <h2 className="text-4xl uppercase tracking-widest font-light">Search the <br /> techno Network</h2>
                        <p className="text-gray-100 text-md">
                            A global defense and security group shaping tomorrow across land, air, and sea.
                        </p>
                    </div>
                    <Image
                        src="/search.png"
                        alt="search"
                        width={120}
                        height={120}
                        className="hidden lg:block"
                    />
                </div>
                <div className="relative w-full lg:w-auto lg:flex-1 flex items-end">
                    <div className="relative w-full flex items-end">
                        <input
                            type="text"
                            placeholder="What are you looking for? Vehicles, UAVs, Maritime Systems, Support..."
                            className="focus:outline-none lg:w-full mb-2"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-400/30"></div>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-sm font-medium underline hover:no-underline transition-all">
                            SEARCH
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchTheNetwork
