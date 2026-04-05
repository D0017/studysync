import { useParams, Link } from "react-router-dom";

export default function ModuleResources() {

  const { moduleName } = useParams();

  const storedUser =
    JSON.parse(localStorage.getItem("user"));

  const role = storedUser?.role;

  const allResources =
    JSON.parse(localStorage.getItem("resources")) || [];

  const moduleResources =
    allResources.filter(r =>
      r.module.toLowerCase() ===
      moduleName.toLowerCase()
    );

  const deleteResource = id => {

    if (!window.confirm("Delete resource?"))
      return;

    const updated =
      allResources.filter(r => r.id !== id);

    localStorage.setItem(
      "resources",
      JSON.stringify(updated)
    );

    window.location.reload();

  };

  const editResource = resource => {

    localStorage.setItem(
      "editResource",
      JSON.stringify(resource)
    );

    window.location.href =
      "/upload-resource";

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0C] to-[#1a0d05] text-white">

      <div className="max-w-4xl mx-auto pt-16 px-6">

        <div className="bg-gradient-to-r from-[#1F1F23] to-[#2a1408] border border-orange-500/20 rounded-2xl p-10 shadow-lg shadow-orange-500/10">

          <h1 className="text-3xl font-bold text-orange-400">

            {moduleName}

          </h1>

          <p className="text-gray-400 mt-2">

            Module resources

          </p>

        </div>

      </div>


      <div className="max-w-4xl mx-auto py-10 px-6 space-y-4">

        {moduleResources.length === 0 && (

          <div className="bg-[#1F1F23] border border-orange-500/10 rounded-xl p-6 text-center text-gray-400">

            No resources uploaded yet

          </div>

        )}


        {moduleResources.map(file => (

          <div

            key={file.id}

            className="bg-gradient-to-r from-[#1F1F23] to-[#140a05] border border-orange-500/10 backdrop-blur-lg rounded-xl p-5 flex justify-between items-center hover:border-orange-500 hover:shadow-orange-500/20 hover:shadow-lg transition"

          >

            <div>

              <p className="font-medium text-orange-300">

                📄 {file.title}

              </p>

              <p className="text-xs text-gray-400 mt-1">

                Year {file.year} • Semester {file.semester}

              </p>

            </div>


            <div className="flex gap-4 text-sm">

              <a

                href={file.fileURL}

                download={file.fileName}

                className="text-blue-400 hover:text-blue-300"

              >

                Download

              </a>


              {role === "LECTURER" && (

                <>

                  <button

                    onClick={() =>
                      editResource(file)
                    }

                    className="text-green-400 hover:text-green-300"

                  >

                    Edit

                  </button>


                  <button

                    onClick={() =>
                      deleteResource(file.id)
                    }

                    className="text-red-400 hover:text-red-300"

                  >

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

            state={{ moduleName }}

            className="block text-center bg-gradient-to-r from-[#FF6A00] to-[#ff8c42] py-3 rounded-xl mt-8 shadow-lg shadow-orange-500/40 hover:scale-105 transition"

          >

            + Add Resource

          </Link>

        )}

      </div>

    </div>

  );

}