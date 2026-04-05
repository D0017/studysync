export default function ResourceCard({ resource }) {

    return (

        <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.3)] transition duration-300 hover:border-[#FF6A00]/35 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(255,106,0,0.12)] text-white">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.14),_transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100"></div>

            <div className="relative">
                <div className="flex items-start justify-between gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/10 text-2xl">
                        📄
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">
                        Resource
                    </div>

                </div>

                <h3 className="mt-5 text-xl font-bold text-white leading-snug">
                    {resource.title}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-300">

                    <p>
                        <span className="font-semibold text-[#FF6A00]">Module:</span> {resource.module}
                    </p>

                    <p>
                        <span className="font-semibold text-[#FF6A00]">Year:</span> {resource.year}
                    </p>

                    <p>
                        <span className="font-semibold text-[#FF6A00]">Uploaded By:</span> {resource.uploadedBy}
                    </p>

                </div>
            </div>

        </div>

    );

}