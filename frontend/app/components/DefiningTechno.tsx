import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
const DefiningTechno = () => {
    return (
        <section className="bg-black text-white flex items-center justify-center py-14 px-8">
            <div className="w-full border-t border-gray-700 py-10 md:px-14 grid md:grid-cols-3 gap-10">
                <div>
                    <p className="text-xs text-amber-300 tracking-widest font-light uppercase text-left md:text-center">
                        {"// Defining Techno"}
                    </p>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <p className="text-gray-200 text-xl md:text-2xl">
                        Techno International Group is a premier provider of defense and security solutions,
                        dedicated to enhancing national security and operational readiness across the globe.
                        With decades of experience and a network of over 4,000 experts across Africa and beyond,
                        we deliver comprehensive, mission-ready solutions tailored to armed forces, law enforcement
                        agencies, and government institutions.
                    </p>
                    <div className="flex-col md:flex-row flex gap-3">
                        <Button variant="outline" className="uppercase text-white text-sm md:text-xs font-semibold max-w-xl bg-black mt-6 border-gray-700 rounded-none w-fit ">
                            Explore
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="uppercase text-white text-sm md:text-xs font-semibold max-w-xl bg-black mt-6 border-gray-700 rounded-none w-fit">
                            Download Company Profile
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DefiningTechno;
