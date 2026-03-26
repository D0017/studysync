import { useParams, Link } from "react-router-dom";

export default function ModuleResources() {

  const { facultyName, moduleName } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const role = storedUser?.role;

  // dummy files
  const files = [

    { name: "Past Paper 2024.pdf" },

    { name: "Lecture 1.pdf" }

  ];

  return (

    <div className="min-h-screen bg-[#F4F4F6]">

      <div className="bg-[#1F1F23] text-white py-14 text-center">

        <h1 className="text-3xl font-bold">

          {moduleName}

        </h1>

      </div>


      <div className="max-w-4xl mx-auto py-10 space-y-4">

        {files.map(file => (

          <div

            key={file.name}

            className="bg-white rounded-xl shadow p-4 flex justify-between"
          >

            <span>

              📄 {file.name}

            </span>

            <div className="space-x-3">

              <button className="text-blue-600">

                Download

              </button>


              {role === "LECTURER" && (

                <>

                  <button className="text-green-600">

                    Edit

                  </button>

                  <button className="text-red-600">

                    Delete

                  </button>

                </>

              )}

            </div>

          </div>

        ))}


        {role === "LECTURER" && (

          <Link

            to="/upload-resource"

            className="block mt-6 text-center bg-[#FF6A00] text-white py-3 rounded-xl shadow"
          >

            + Add Resource

          </Link>

        )}

      </div>

    </div>

  );

}