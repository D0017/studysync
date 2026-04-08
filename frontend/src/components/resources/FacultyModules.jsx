import { useParams, Link } from "react-router-dom";
import GlassBackButton from "../GlassBackButton";

export default function FacultyModules() {

  const { facultyName } = useParams();

  const modules = {
    Computing: ["ITPM", "OOP", "DSA"],
    Business: ["Marketing", "Finance"],
    Engineering: ["Thermodynamics"],
    "Quantity Surveying": ["QS101"],
    MBA: ["Leadership"],
    MSC: ["Research Methods"]
  };

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.18),_transparent_22%),linear-gradient(135deg,#050506_0%,#0A0A0C_40%,#120b07_100%)] text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <GlassBackButton to="/resources" label="Back to Resources" />

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.22),_transparent_28%)] pointer-events-none"></div>

          <div className="relative px-8 py-10 md:px-12 md:py-12">

            <div className="inline-flex items-center rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-4 py-2 text-sm font-semibold text-[#FF6A00]">
              Faculty Workspace
            </div>

            <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  {facultyName} Modules
                </h1>

                <p className="mt-3 max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed">
                  Browse module folders under {facultyName} and access resources relevant
                  to the academic pathway.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                  Total Modules
                </p>
                <p className="mt-2 text-2xl font-bold text-[#FF6A00]">
                  {modules[facultyName]?.length || 0}
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Section */}
        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6A00]">
            Modules
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
            Select a Module
          </h2>
          <p className="mt-2 text-gray-400">
            Open a module folder to view uploaded resources and manage academic files.
          </p>
        </div>


        {/* Module Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">

          {modules[facultyName]?.map((module, index) => (

            <Link
              key={module}
              to={`/resources/${facultyName}/${module}`}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6A00]/40 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(255,106,0,0.12)]"
            >

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.14),_transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100"></div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/10 text-4xl">
                    📂
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">
                    M{index + 1}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-white">
                    {module}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    Open this module to access learning materials, files, videos,
                    and downloadable archives.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#FF6A00]">
                    Open Module
                  </span>

                  <span className="text-lg text-white transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );

}