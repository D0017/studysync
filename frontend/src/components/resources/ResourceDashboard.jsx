import { Link } from "react-router-dom";

export default function ResourceDashboard() {

  const storedUser =
    JSON.parse(localStorage.getItem("user"));

  const role = storedUser?.role;

  const modules = [
    "Computing",
    "Business",
    "Engineering",
    "Quantity Surveying",
    "MBA",
    "MSC"
  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0C] to-[#1a0d05] text-white">

      {/* header */}
      <div className="max-w-6xl mx-auto pt-16 px-6">

        <div className="bg-gradient-to-r from-[#1F1F23] to-[#2a1408] border border-orange-500/20 rounded-2xl p-10 shadow-lg shadow-orange-500/10">

          <h1 className="text-4xl font-bold text-orange-400">

            Resource Library

          </h1>

          <p className="text-gray-400 mt-2">

            Access shared learning materials

          </p>

        </div>

      </div>


      {/* folders */}
      <div className="max-w-6xl mx-auto py-14 px-6">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

          {modules.map(module => (

            <Link

              key={module}

              to={`/resources/${module}`}

              className="bg-gradient-to-br from-[#1F1F23] to-[#140a05] border border-orange-500/10 backdrop-blur-lg p-8 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition duration-300"

            >

              <div className="text-5xl mb-3 text-orange-400">

                📁

              </div>

              <h3 className="font-semibold">

                {module}

              </h3>

            </Link>

          ))}

        </div>


        {role === "LECTURER" && (

          <div className="mt-14 text-center">

            <Link

              to="/upload-resource"

              className="bg-gradient-to-r from-[#FF6A00] to-[#ff8c42] px-10 py-3 rounded-xl shadow-lg shadow-orange-500/40 hover:scale-105 transition"

            >

              + Add Faculties

            </Link>

          </div>

        )}

      </div>

    </div>

  );

}