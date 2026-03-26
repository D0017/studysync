import { Link } from "react-router-dom";

export default function ResourceDashboard() {

  const storedUser = JSON.parse(localStorage.getItem("user"));

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

    <div className="min-h-screen bg-[#F4F4F6]">



      {/* top banner */}

      <div className="bg-[#1F1F23] text-white py-16 text-center">

        <h1 className="text-4xl font-bold">

          Resource Library

        </h1>



        <p className="text-gray-300 mt-2">

          Access shared learning materials

        </p>

      </div>



      {/* folders */}

      <div className="max-w-6xl mx-auto py-12 px-6">



        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">



          {modules.map((module) => (



        <Link
            key={module}
            to={`/resources/${module}`}
            className="bg-white/60 backdrop-blur-lg shadow-md rounded-2xl p-8 text-center hover:scale-105 transition"
        >

        <div className="text-5xl mb-4">
            📁
        </div>

        <h3 className="font-semibold text-[#0A0A0C]">
            {module}
        </h3>

        </Link>


          ))}



        </div>



        {/* lecturer button */}

        {role === "LECTURER" && (



          <div className="text-center mt-12">



            <Link

              to="/upload-resource"

              className="bg-[#FF6A00] text-white px-8 py-3 rounded-xl shadow-lg hover:opacity-90"

            >



              + Add Resource



            </Link>



          </div>



        )}



      </div>



    </div>

  );

}