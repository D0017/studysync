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
        "Delete this resource?"
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
    window.location.href =
      "/upload-resource";

  };

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.18),_transparent_22%),linear-gradient(135deg,#050506_0%,#0A0A0C_40%,#120b07_100%)] text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.22),_transparent_28%)] pointer-events-none"></div>

          <div className="relative px-8 py-10 md:px-12 md:py-12">

            <div className="inline-flex items-center rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-4 py-2 text-sm font-semibold text-[#FF6A00]">
              Module Resource Space
            </div>

            <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  {moduleName}
                </h1>

                <p className="mt-3 max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed">
                  View, manage, and access uploaded resources for this module in a
                  structured academic workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                  Total Files
                </p>
                <p className="mt-2 text-2xl font-bold text-[#FF6A00]">
                  {moduleResources.length}
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Section Title */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6A00]">
              Resources
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
              Module Files
            </h2>
            <p className="mt-2 text-gray-400">
              Explore the available files below. Lecturers can edit or remove files,
              while students can download and view them.
            </p>
          </div>

          {role === "LECTURER" && (

            <Link
              to="/upload-resource"
              state={{ moduleName }}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff8c42] px-7 py-3 text-base font-bold text-white shadow-[0_10px_35px_rgba(255,106,0,0.35)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(255,106,0,0.45)]"
            >
              + Add Resource
            </Link>

          )}

        </div>


        {/* Empty State */}
        {moduleResources.length === 0 && (

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.3)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#FF6A00]/20 bg-[#FF6A00]/10 text-4xl">
              📄
            </div>

            <h3 className="mt-5 text-2xl font-bold text-white">
              No resources uploaded yet
            </h3>

            <p className="mt-2 text-gray-400 max-w-xl mx-auto">
              This module does not have any uploaded resources at the moment.
              Upload academic files to start building the module library.
            </p>
          </div>

        )}


        {/* Resource Cards */}
        <div className="mt-8 space-y-5">

          {moduleResources.map(file => (

            <div
              key={file.id}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.3)] transition duration-300 hover:border-[#FF6A00]/35 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(255,106,0,0.12)]"
            >

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.14),_transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100"></div>

              <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/10 text-2xl">
                    📄
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      {file.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                        Module: {moduleName}
                      </span>

                      {file.year && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                          Year: {file.year}
                        </span>
                      )}

                      {file.semester && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                          Semester: {file.semester}
                        </span>
                      )}
                    </div>
                  </div>
                </div>


                <div className="flex flex-wrap items-center gap-3 md:justify-end">

                  <a
                    href={file.fileURL}
                    download={file.fileName}
                    className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-400/20"
                  >
                    Download
                  </a>

                  {role === "LECTURER" && (

                    <>
                      <button
                        onClick={() =>
                          editResource(file)
                        }
                        className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-400/20"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteResource(file.id)
                        }
                        className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
                      >
                        Delete
                      </button>
                    </>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}