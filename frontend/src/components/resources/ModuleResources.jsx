import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import resourceService from "./resourceService";
import GlassBackButton from "../GlassBackButton";

export default function ModuleResources() {
  const { facultyName, moduleName } = useParams();

  const storedUser =
    JSON.parse(localStorage.getItem("user"));

  const role = storedUser?.role;

  const [moduleResources, setModuleResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardRoute = () => {
    if (storedUser?.role === "LECTURER")
      return "/lecturer-dashboard";

    if (storedUser?.role === "STUDENT")
      return "/student-dashboard";

    if (storedUser?.role === "ADMIN")
      return "/admin-dashboard";

    return "/login";
  };

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

  const handleAddResource = () => {
    localStorage.removeItem("editResource");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getFileTypeLabel = (file) => {
    const originalName = file.originalFileName || "";
    const extension = originalName.includes(".")
      ? originalName.split(".").pop()?.toUpperCase()
      : "";

    if (extension) return extension;
    if (file.fileType?.includes("pdf")) return "PDF";
    if (file.fileType?.includes("mp4")) return "MP4";
    if (file.fileType?.includes("video")) return "VIDEO";
    if (file.fileType?.includes("image")) return "IMAGE";

    return "FILE";
  };

  const getFileIcon = (file) => {
    const type = getFileTypeLabel(file);

    if (type === "PDF") return "📕";
    if (type === "MP4" || type === "VIDEO") return "🎬";
    if (type === "IMAGE") return "🖼️";
    return "📚";
  };

  const getLecturerName = (file) => {
    return (
      file.uploadedBy ||
      file.lecturerName ||
      file.uploadedByName ||
      "Unknown Lecturer"
    );
  };

  const getUploadedDate = (file) => {
    return (
      file.uploadDate ||
      file.createdAt ||
      file.createdDate ||
      file.updatedDate
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.18),_transparent_22%),linear-gradient(135deg,#050506_0%,#0A0A0C_40%,#120b07_100%)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <GlassBackButton to="/resources" label="Back to Resources" />

          <Link
            to={getDashboardRoute()}
            className="rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff8c42] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,106,0,0.35)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_12px_35px_rgba(255,106,0,0.45)]"
          >
            Dashboard
          </Link>
        </div>

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

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6A00]">
              Resources
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
              Module Files
            </h2>
            <p className="mt-2 text-gray-400">
              Students can see lecturer name, uploaded date, file type, year,
              and semester. Lecturers can also edit or delete files.
            </p>
          </div>

          {role === "LECTURER" && (
            <Link
              to="/upload-resource"
              state={{ moduleName, facultyName }}
              onClick={handleAddResource}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff8c42] px-7 py-3 text-base font-bold text-white shadow-[0_10px_35px_rgba(255,106,0,0.35)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(255,106,0,0.45)]"
            >
              + Add Resource
            </Link>
          )}
        </div>

        {loading && (
          <p className="mt-8 text-center text-gray-400">
            Loading resources...
          </p>
        )}

        {!loading && moduleResources.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.3)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#FF6A00]/20 bg-[#FF6A00]/10 text-4xl">
              📚
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

        {!loading && moduleResources.length > 0 && (
          <div className="mt-8 space-y-5">
            {moduleResources.map((file) => (
              <div
                key={file.id}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.3)] transition duration-300 hover:border-[#FF6A00]/35 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(255,106,0,0.12)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,106,0,0.14),_transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100"></div>

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-5 flex-1 min-w-0">
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-[22px] border border-[#FF6A00]/20 bg-[#FF6A00]/10 text-4xl shadow-[0_0_25px_rgba(255,106,0,0.08)]">
                      {getFileIcon(file)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-bold text-white leading-snug break-words">
                        {file.title}
                      </h3>

                      <p className="mt-2 text-base text-gray-300 break-words">
                        {file.originalFileName || "Unnamed file"}
                      </p>

                      <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                        {getFileTypeLabel(file)} resource for {moduleName}. Uploaded for
                        Year {file.year || "N/A"}, Semester {file.semester || "N/A"}.
                        Students can view details and download this file.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        <span className="text-gray-300">
                          <span className="text-gray-500">Type:</span>{" "}
                          <span className="font-semibold text-white">
                            {getFileTypeLabel(file)}
                          </span>
                        </span>

                        <span className="text-gray-300">
                          <span className="text-gray-500">Year:</span>{" "}
                          <span className="font-semibold text-white">
                            {file.year || "Not specified"}
                          </span>
                        </span>

                        <span className="text-gray-300">
                          <span className="text-gray-500">Semester:</span>{" "}
                          <span className="font-semibold text-white">
                            {file.semester || "Not specified"}
                          </span>
                        </span>

                        <span className="text-gray-300">
                          <span className="text-gray-500">Uploaded:</span>{" "}
                          <span className="font-semibold text-white">
                            {formatDate(getUploadedDate(file))}
                          </span>
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-gray-300">
                        <span className="text-gray-500">Uploaded by </span>
                        <span className="font-semibold text-white">
                          {getLecturerName(file)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                    <a
                      href={resourceService.getDownloadUrl(file.id)}
                      className="inline-flex min-w-[120px] items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-400/20"
                    >
                      Download
                    </a>

                    {role === "LECTURER" && (
                      <>
                        <button
                          onClick={() => editResource(file)}
                          className="inline-flex min-w-[120px] items-center justify-center rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-400/20"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteResource(file.id)}
                          className="inline-flex min-w-[120px] items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
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
        )}
      </div>
    </div>
  );
}