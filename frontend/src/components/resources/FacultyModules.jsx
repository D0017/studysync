import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import GlassBackButton from "../GlassBackButton";

export default function FacultyModules() {
  const { facultyName } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const fallbackModules = {
    Computing: [
      { name: "ITPM", year: 2, semester: 1, createdAt: "2026-04-08" },
      { name: "OOP", year: 1, semester: 2, createdAt: "2026-04-06" },
      { name: "DSA", year: 2, semester: 2, createdAt: "2026-04-04" }
    ],
    Business: [
      { name: "Marketing", year: 1, semester: 1, createdAt: "2026-04-03" },
      { name: "Finance", year: 2, semester: 1, createdAt: "2026-04-07" }
    ],
    Engineering: [
      { name: "Thermodynamics", year: 2, semester: 1, createdAt: "2026-04-05" }
    ],
    "Quantity Surveying": [
      { name: "QS101", year: 1, semester: 1, createdAt: "2026-04-02" }
    ],
    MBA: [
      { name: "Leadership", year: 1, semester: 2, createdAt: "2026-04-01" }
    ],
    MSC: [
      { name: "Research Methods", year: 1, semester: 1, createdAt: "2026-04-08" }
    ]
  };

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("default");

  const getDashboardRoute = () => {
    if (storedUser?.role === "LECTURER") return "/lecturer-dashboard";
    if (storedUser?.role === "STUDENT") return "/student-dashboard";
    if (storedUser?.role === "ADMIN") return "/admin-dashboard";
    return "/login";
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resources");

        if (!response.ok) {
          throw new Error("Failed to load resources");
        }

        const data = await response.json();
        setResources(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Database fetch failed, using fallback modules:", error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const moduleCards = useMemo(() => {
    const fallbackForFaculty = fallbackModules[facultyName] || [];

    const grouped = {};

    fallbackForFaculty.forEach((item, index) => {
      grouped[item.name] = {
        module: item.name,
        years: item.year ? [String(item.year)] : [],
        semesters: item.semester ? [String(item.semester)] : [],
        latestDate: item.createdAt ? new Date(item.createdAt) : null,
        oldestDate: item.createdAt ? new Date(item.createdAt) : null,
        totalResources: 0,
        defaultIndex: index
      };
    });

    const facultyResources = resources.filter(
      (item) =>
        item?.faculty &&
        item.faculty.toLowerCase() === decodeURIComponent(facultyName).toLowerCase()
    );

    facultyResources.forEach((item) => {
      const moduleName = item?.module?.trim();
      if (!moduleName) return;

      if (!grouped[moduleName]) {
        grouped[moduleName] = {
          module: moduleName,
          years: [],
          semesters: [],
          latestDate: null,
          oldestDate: null,
          totalResources: 0,
          defaultIndex: Object.keys(grouped).length
        };
      }

      const entry = grouped[moduleName];

      if (item?.year !== undefined && item?.year !== null && item?.year !== "") {
        const yearValue = String(item.year).trim();
        if (!entry.years.includes(yearValue)) {
          entry.years.push(yearValue);
        }
      }

      if (item?.semester !== undefined && item?.semester !== null && item?.semester !== "") {
        const semesterValue = String(item.semester).trim();
        if (!entry.semesters.includes(semesterValue)) {
          entry.semesters.push(semesterValue);
        }
      }

      const rawDate =
        item?.updatedDate ||
        item?.uploadDate ||
        item?.createdAt ||
        item?.date;

      const parsedDate = rawDate ? new Date(rawDate) : null;
      const validDate =
        parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;

      if (validDate) {
        if (!entry.latestDate || validDate > entry.latestDate) {
          entry.latestDate = validDate;
        }

        if (!entry.oldestDate || validDate < entry.oldestDate) {
          entry.oldestDate = validDate;
        }
      }

      entry.totalResources += 1;
    });

    let result = Object.values(grouped);

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase().trim();
      result = result.filter((item) =>
        item.module.toLowerCase().includes(keyword)
      );
    }

    result.sort((a, b) => {
      if (sortType === "newToOld") {
        const aTime = a.latestDate ? a.latestDate.getTime() : 0;
        const bTime = b.latestDate ? b.latestDate.getTime() : 0;
        return bTime - aTime;
      }

      if (sortType === "oldToNew") {
        const aTime = a.oldestDate ? a.oldestDate.getTime() : 0;
        const bTime = b.oldestDate ? b.oldestDate.getTime() : 0;
        return aTime - bTime;
      }

      if (sortType === "yearSemesterWise") {
        const aYear = Math.min(
          ...a.years
            .map((y) => parseInt(String(y).replace(/\D/g, ""), 10))
            .filter((n) => !Number.isNaN(n)),
          Number.MAX_SAFE_INTEGER
        );

        const bYear = Math.min(
          ...b.years
            .map((y) => parseInt(String(y).replace(/\D/g, ""), 10))
            .filter((n) => !Number.isNaN(n)),
          Number.MAX_SAFE_INTEGER
        );

        if (aYear !== bYear) return aYear - bYear;

        const aSemester = Math.min(
          ...a.semesters
            .map((s) => parseInt(String(s).replace(/\D/g, ""), 10))
            .filter((n) => !Number.isNaN(n)),
          Number.MAX_SAFE_INTEGER
        );

        const bSemester = Math.min(
          ...b.semesters
            .map((s) => parseInt(String(s).replace(/\D/g, ""), 10))
            .filter((n) => !Number.isNaN(n)),
          Number.MAX_SAFE_INTEGER
        );

        return aSemester - bSemester || a.module.localeCompare(b.module);
      }

      return a.defaultIndex - b.defaultIndex;
    });

    return result;
  }, [resources, facultyName, searchTerm, sortType]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.18),_transparent_22%),linear-gradient(135deg,#050506_0%,#0A0A0C_40%,#120b07_100%)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <GlassBackButton
            to="/resources"
            label="Back to Resources"
          />

          <Link
            to={getDashboardRoute()}
            className="rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff8c42] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,106,0,0.35)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_12px_35px_rgba(255,106,0,0.45)]"
          >
            Dashboard
          </Link>
        </div>

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
                  {moduleCards.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            {/* Sort Left */}
            <div className="flex-1">
              <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
                Sort Modules
              </label>

              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Default", value: "default" },
                  { label: "New to Old", value: "newToOld" },
                  { label: "Old to New", value: "oldToNew" },
                  { label: "Year + Semester", value: "yearSemesterWise" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSortType(item.value)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
                      sortType === item.value
                        ? "bg-[#FF6A00] text-white shadow-[0_10px_30px_rgba(255,106,0,0.30)]"
                        : "border border-white/10 bg-white/5 text-gray-300 hover:border-[#FF6A00]/30 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Right */}
            <div className="w-full xl:max-w-md">
              <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
                Search Modules
              </label>
              <input
                type="text"
                placeholder="Search module name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#0A0A0C]/80 px-5 py-4 text-white outline-none transition duration-300 placeholder:text-gray-500 focus:border-[#FF6A00]/60 focus:ring-2 focus:ring-[#FF6A00]/20"
              />
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

        {loading && (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-gray-300 backdrop-blur-2xl">
            Loading modules from database...
          </div>
        )}

        {/* Module Cards */}
        {moduleCards.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
            {moduleCards.map((moduleItem, index) => (
              <Link
                key={moduleItem.module}
                to={`/resources/${facultyName}/${moduleItem.module}`}
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
                      {moduleItem.module}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {moduleItem.years.length > 0 && (
                        <span className="rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-3 py-1 text-xs font-medium text-[#FFB37A]">
                          Year {moduleItem.years.join(", ")}
                        </span>
                      )}

                      {moduleItem.semesters.length > 0 && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                          Semester {moduleItem.semesters.join(", ")}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm text-gray-400 leading-relaxed">
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
        )}

        {!loading && moduleCards.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-gray-300 backdrop-blur-2xl">
            No modules found for this faculty.
          </div>
        )}
      </div>
    </div>
  );
}