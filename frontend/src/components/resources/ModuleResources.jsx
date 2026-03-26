import { useParams, Link } from "react-router-dom";

export default function ModuleResources() {

  const { facultyName, moduleName } = useParams();

  const storedUser =
    JSON.parse(localStorage.getItem("user"));

  const role =
    storedUser?.role;



  const allResources =
    JSON.parse(
      localStorage.getItem("resources")
    ) || [];


  const moduleResources =
    allResources.filter(r =>

      r.module.toLowerCase() ===
      moduleName.toLowerCase()

    );



  const deleteResource = id => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete?"
      );

    if (!confirmDelete) return;


    const updated =
      allResources.filter(
        r => r.id !== id
      );


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

    <div className="min-h-screen bg-[#F4F4F6]">

      <div className="bg-[#1F1F23] text-white py-14 text-center">

        <h1 className="text-3xl font-bold">

          {moduleName}

        </h1>

      </div>



      <div className="max-w-4xl mx-auto py-10 space-y-4">

        {moduleResources.length === 0 && (

          <p className="text-center text-gray-500">

            No resources uploaded yet

          </p>

        )}



        {moduleResources.map(file => (

          <div

            key={file.id}

            className="bg-white rounded-xl shadow p-4 flex justify-between"

          >

            <span>

              📄 {file.title}.pdf

            </span>



            <div className="space-x-3">

              <a

                href={file.fileURL}

                download={file.fileName}

                className="text-blue-600"

              >

                Download

              </a>



              {role === "LECTURER" && (

                <>

                  <button

                    onClick={() =>

                      editResource(file)

                    }

                    className="text-green-600"

                  >

                    Edit

                  </button>



                  <button

                    onClick={() =>

                      deleteResource(file.id)

                    }

                    className="text-red-600"

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

            className="block mt-6 text-center bg-[#FF6A00] text-white py-3 rounded-xl shadow"

          >

            + Add Resource

          </Link>

        )}

      </div>

    </div>

  );

}