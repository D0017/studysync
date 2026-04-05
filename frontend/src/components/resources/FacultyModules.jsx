import { useParams, Link } from "react-router-dom";

export default function FacultyModules() {

  const { facultyName } = useParams();

  const modules = {
    Computing: ["ITPM","OOP","DSA"],
    Business: ["Marketing","Finance"],
    Engineering: ["Thermodynamics"],
    "Quantity Surveying": ["QS101"],
    MBA: ["Leadership"],
    MSC: ["Research Methods"]
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0C] to-[#1a0d05] text-white">

      <div className="max-w-6xl mx-auto pt-16 px-6">

        <div className="bg-gradient-to-r from-[#1F1F23] to-[#2a1408] border border-orange-500/20 rounded-2xl p-10 shadow-lg shadow-orange-500/10">

          <h1 className="text-3xl font-bold text-orange-400">

            {facultyName} Modules

          </h1>

          <p className="text-gray-400 mt-2">

            Choose a module

          </p>

        </div>

      </div>


      <div className="max-w-6xl mx-auto py-14 px-6 grid grid-cols-2 md:grid-cols-3 gap-8">

        {modules[facultyName]?.map(module => (

          <Link

            key={module}

            to={`/resources/${facultyName}/${module}`}

            className="bg-gradient-to-br from-[#1F1F23] to-[#140a05] border border-orange-500/10 backdrop-blur-lg p-8 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition"

          >

            <div className="text-4xl mb-2 text-orange-400">

              📂

            </div>

            <p className="font-semibold">

              {module}

            </p>

          </Link>

        ))}

      </div>

    </div>

  );

}