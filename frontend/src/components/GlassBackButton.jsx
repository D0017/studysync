import { Link } from "react-router-dom";

export default function GlassBackButton({ to, label = "Back" }) {

    return (

        <div className="mb-6">

            <Link
                to={to}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#FF6A00]/40 hover:bg-white/[0.08] hover:text-[#FF6A00]"
            >
                <span className="text-lg">←</span>
                {label}
            </Link>

        </div>

    );

}