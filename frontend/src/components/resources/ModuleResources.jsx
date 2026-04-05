import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import resourceService from "./resourceService";

export default function ModuleResources() {
  const { facultyName, moduleName } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role;

  const [moduleResources, setModuleResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResourcesByFacultyAndModule(
        facultyName,
        moduleName
      );
      setModuleResources(data);
    } catch (error) {
      console.error(error);
      setModuleResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [facultyName, moduleName]);

  const deleteResource = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {
      await resourceService.deleteResource(id);
      fetchResources();
    } catch (error) {
      console.error(error);
      alert("Failed to delete resource");
    }
  };

  const editResource = (resource) => {
    localStorage.setItem(
      "editResource",
      JSON.stringify(resource)
    );

    window.location.href = "/upload-resource";
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <div className="bg-[#1F1F23] text-white py-14 text-center">
        <h1 className="text-3xl font-bold">
          {moduleName}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto py-10 space-y-4 px-6">
        {loading && (
          <p className="text-center text-gray-500">
            Loading resources...
          </p>
        )}

        {!loading && moduleResources.length === 0 && (
          <p className="text-center text-gray-500">
            No resources uploaded yet
          </p>
        )}

        {moduleResources.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div>
              <span className="font-medium">
                📄 {file.title}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {file.originalFileName || "File"} • {file.fileType || "Unknown type"}
              </p>
            </div>

            <div className="space-x-3">
              <a
                href={resourceService.getDownloadUrl(file.id)}
                className="text-blue-600"
              >
                Download
              </a>

              {role === "LECTURER" && (
                <>
                  <button
                    onClick={() => editResource(file)}
                    className="text-green-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteResource(file.id)}
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
            state={{ moduleName, facultyName }}
            className="block mt-6 text-center bg-[#FF6A00] text-white py-3 rounded-xl shadow"
          >
            + Add Resource
          </Link>
        )}
      </div>
    </div>
  );
}