import { useParams, Link } from "react-router-dom";

export default function FacultyModules() {

  const { facultyName } = useParams();

  // temporary modules
  const modules = {
    Computing: ["ITPM","OOP","DSA"],
    Business: ["Marketing","Finance"],
    Engineering: ["Thermodynamics"],
    "Quantity Surveying": ["QS101"],
    MBA: ["Leadership"],
    MSC: ["Research Methods"]
  };

  return (

    <div className="min-h-screen bg-[#F4F4F6]">

      <div className="bg-[#1F1F23] text-white py-14 text-center">

        <h1 className="text-3xl font-bold">

          {facultyName} Modules

        </h1>

      </div>


      <div className="max-w-5xl mx-auto py-10 grid grid-cols-2 md:grid-cols-3 gap-6">

        {modules[facultyName]?.map(module => (

          <Link

            key={module}

            to={`/resources/${facultyName}/${module}`}

            className="bg-white/60 backdrop-blur-lg shadow-md rounded-2xl p-6 text-center hover:scale-105 transition"
          >

            📁

            <p className="mt-2 font-medium">

              {module}

            </p>

          </Link>

        ))}

      </div>

    </div>

  );

}