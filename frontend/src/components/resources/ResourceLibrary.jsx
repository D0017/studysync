import { useEffect, useState } from "react";
import resourceService from "./resourceService";
import ResourceCard from "./ResourceCard";

export default function ResourceLibrary() {

    const [resources, setResources] = useState([]);

    useEffect(() => {

        fetchResources();

    }, []);

    const fetchResources = async () => {

        const data = await resourceService.getAllResources();

        setResources(data);

    };

    return (

        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.18),_transparent_22%),linear-gradient(135deg,#050506_0%,#0A0A0C_40%,#120b07_100%)] text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Hero */}
                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.22),_transparent_28%)] pointer-events-none"></div>

                    <div className="relative px-8 py-10 md:px-12 md:py-12">

                        <div className="inline-flex items-center rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-4 py-2 text-sm font-semibold text-[#FF6A00]">
                            Resource Collection
                        </div>

                        <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-white">
                            Resource Library
                        </h2>

                        <p className="mt-3 max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed">
                            Explore uploaded materials, organized resources, and academic content
                            in a modern digital workspace.
                        </p>

                    </div>

                </div>


                {/* Section */}
                <div className="mt-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6A00]">
                        All Resources
                    </p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                        Uploaded Materials
                    </h3>
                    <p className="mt-2 text-gray-400">
                        View all resources currently available in the system.
                    </p>
                </div>


                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {resources.map(resource => (

                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                        />

                    ))}

                </div>

            </div>

        </div>

    );

}