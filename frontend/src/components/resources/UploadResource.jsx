import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import resourceService from "./resourceService";
import GlassBackButton from "../GlassBackButton";
import libraryBg from "../../assets/seoulbookbogo-1440x1133.jpg";

export default function UploadResource() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const editingResource = JSON.parse(localStorage.getItem("editResource"));

  const moduleFromPage = location.state?.moduleName || editingResource?.module || "";
  const facultyFromPage = location.state?.facultyName || editingResource?.faculty || "";

  const [form, setForm] = useState({
    title: editingResource?.title || "",
    faculty: facultyFromPage,
    module: moduleFromPage,
    year: editingResource?.year || "",
    semester: editingResource?.semester || "",
    lecturerName: storedUser?.fullName || editingResource?.uploadedBy || "",
    description: editingResource?.description || "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [customFileName, setCustomFileName] = useState("");

  const allowedExtensions = [
    "pdf",
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
    "zip",
    "rar",
  ];

  const getExtension = (fileName = "") => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  const isAllowedFile = (selectedFile) => {
    const ext = getExtension(selectedFile?.name);
    return allowedExtensions.includes(ext);
  };

  const validate = () => {
    let newErrors = {};

    if (!form.title || form.title.trim().length < 5) {
      newErrors.title = "Title must contain at least 5 characters";
    }

    if (!form.faculty || !form.faculty.trim()) {
      newErrors.faculty = "Faculty is required";
    }

    if (!form.module || !form.module.trim()) {
      newErrors.module = "Module is required";
    }

    if (!form.year || !form.year.trim()) {
      newErrors.year = "Year is required";
    }

    if (!form.semester || !form.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    if (!form.lecturerName || !form.lecturerName.trim()) {
      newErrors.lecturerName = "Lecturer name is required";
    }

    if (!file && !editingResource?.originalFileName) {
      newErrors.file = "Attachment is required";
    }

    if (file) {
      if (!isAllowedFile(file)) {
        newErrors.file = "Only PDF, video, ZIP, or RAR files are allowed";
      }

      if (file.size < 2000) {
        newErrors.file = "File must be larger than 2KB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const removeExtension = (fileName = "") => {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
  };

  const getFileExtension = (fileName = "") => {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : "";
  };

  const openRenameModal = (selectedFile) => {
    if (!selectedFile) return;

    setPendingFile(selectedFile);
    setCustomFileName(removeExtension(selectedFile.name));
    setShowRenameModal(true);
  };

  const confirmRenameAndAttach = () => {
    if (!pendingFile) return;

    const trimmedName = customFileName.trim();

    if (!trimmedName) {
      setErrors((prev) => ({
        ...prev,
        file: "Attachment name is required",
      }));
      return;
    }

    const extension = getFileExtension(pendingFile.name);

    const renamedFile = new File(
      [pendingFile],
      `${trimmedName}.${extension}`,
      {
        type: pendingFile.type,
        lastModified: pendingFile.lastModified,
      }
    );

    setFile(renamedFile);
    setErrors((prev) => ({
      ...prev,
      file: "",
    }));
    setShowRenameModal(false);
    setPendingFile(null);
  };

  const cancelRenameModal = () => {
    setShowRenameModal(false);
    setPendingFile(null);
    setCustomFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const confirmUpload = window.confirm(
      editingResource
        ? "Are you sure you want to save these changes?"
        : "Are you sure you want to upload this resource?"
    );

    if (!confirmUpload) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("faculty", form.faculty);
      formData.append("module", form.module);
      formData.append("year", form.year);
      formData.append("semester", form.semester);
      formData.append("uploadedBy", form.lecturerName);
      formData.append("description", form.description || "");

      if (file) {
        formData.append("file", file);
      }

      if (editingResource) {
        await resourceService.updateResource(editingResource.id, formData);
        localStorage.removeItem("editResource");
        setSuccess("Resource updated successfully");
      } else {
        await resourceService.createResource(formData);
        setSuccess("Resource uploaded successfully");
      }

      setTimeout(() => {
        navigate(`/resources/${encodeURIComponent(form.faculty)}/${encodeURIComponent(form.module)}`);
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrors({
        api: error?.response?.data?.message || "Failed to save resource",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    openRenameModal(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const backPath =
    form.faculty && form.module
      ? `/resources/${form.faculty}/${form.module}`
      : storedUser?.role === "LECTURER"
      ? "/lecturer-dashboard"
      : storedUser?.role === "STUDENT"
      ? "/student-dashboard"
      : "/login";

  const inputClass =
    "mt-2 w-full rounded-2xl border border-white/20 bg-white/[0.10] px-4 py-3 text-white placeholder:text-gray-300 backdrop-blur-xl shadow-inner shadow-black/10 outline-none transition duration-300 focus:border-[#FF6A00]/70 focus:bg-white/[0.14] focus:ring-2 focus:ring-[#FF6A00]/25";

  const readOnlyClass =
    "mt-2 w-full rounded-2xl border border-white/20 bg-white/[0.10] px-4 py-3 text-gray-100 backdrop-blur-xl shadow-inner shadow-black/10 outline-none";

  const selectClass =
    "mt-2 w-full rounded-2xl border border-white/20 bg-[#2A2A2F] px-4 py-3 text-white shadow-inner shadow-black/10 outline-none transition duration-300 focus:border-[#FF6A00]/70 focus:bg-[#323238] focus:ring-2 focus:ring-[#FF6A00]/25";

  return (
    <div
      className="min-h-screen bg-[#0A0A0C] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${libraryBg})` }}
    >
      <div className="min-h-screen bg-[linear-gradient(135deg,rgba(8,8,12,0.72)_0%,rgba(12,12,18,0.74)_35%,rgba(30,18,10,0.68)_100%)]">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.22),transparent_24%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,180,120,0.12),transparent_28%)] flex justify-center items-center p-6 md:p-10">
          <div className="w-full max-w-3xl">
            <div className="mb-6">
              <GlassBackButton to={backPath} label="Back" />
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/[0.10] backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.20),transparent_28%)] pointer-events-none"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_24%)] pointer-events-none"></div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_22%,transparent_78%,rgba(255,255,255,0.03))] pointer-events-none"></div>

              <form
                onSubmit={handleSubmit}
                className="relative p-7 md:p-10 space-y-6 text-white"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="inline-flex items-center rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#FFB06A] shadow-[0_0_30px_rgba(255,106,0,0.12)]">
                      Academic Upload Space
                    </div>

                    <h2 className="mt-5 bg-gradient-to-r from-[#FF6A00] via-[#ff9d57] to-[#ffd2a6] bg-clip-text text-4xl md:text-5xl font-black tracking-tight text-transparent">
                      {editingResource ? "Edit Resource" : "Upload Resource"}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm md:text-base text-gray-200 leading-relaxed">
                      Upload learning materials into the selected module workspace with a clean,
                      premium, library-inspired experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:min-w-[240px]">
                    <div className="rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-gray-300">
                        Faculty
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white truncate">
                        {form.faculty || "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-gray-300">
                        Module
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white truncate">
                        {form.module || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {errors.api && (
                  <div className="rounded-2xl border border-red-400/30 bg-red-500/18 px-4 py-3 text-center text-red-100 backdrop-blur-xl">
                    {errors.api}
                  </div>
                )}

                <div className="grid gap-6">
                  <section className="rounded-[28px] border border-white/15 bg-white/[0.07] p-5 md:p-6 backdrop-blur-xl">
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB06A]">
                        Resource Details
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">
                        Basic Information
                      </h3>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="text-sm text-gray-200">Resource Title *</label>
                        <input
                          value={form.title}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              title: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="Enter resource title"
                        />
                        <p className="mt-2 text-sm text-red-300">{errors.title}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label className="text-sm text-gray-200">Faculty *</label>
                          <input
                            value={form.faculty}
                            readOnly
                            className={readOnlyClass}
                          />
                          <p className="mt-2 text-sm text-red-300">{errors.faculty}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-200">Module *</label>
                          <input
                            value={form.module}
                            readOnly
                            className={readOnlyClass}
                          />
                          <p className="mt-2 text-sm text-red-300">{errors.module}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label className="text-sm text-gray-200">Year *</label>
                          <select
                            value={form.year}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                year: e.target.value,
                              })
                            }
                            className={selectClass}
                            style={{ colorScheme: "dark" }}
                          >
                            <option value="" className="bg-[#2A2A2F] text-white">
                              Select Year
                            </option>
                            <option value="1" className="bg-[#2A2A2F] text-white">
                              Year 1
                            </option>
                            <option value="2" className="bg-[#2A2A2F] text-white">
                              Year 2
                            </option>
                            <option value="3" className="bg-[#2A2A2F] text-white">
                              Year 3
                            </option>
                            <option value="4" className="bg-[#2A2A2F] text-white">
                              Year 4
                            </option>
                          </select>
                          <p className="mt-2 text-sm text-red-300">{errors.year}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-200">Semester *</label>
                          <select
                            value={form.semester}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                semester: e.target.value,
                              })
                            }
                            className={selectClass}
                            style={{ colorScheme: "dark" }}
                          >
                            <option value="" className="bg-[#2A2A2F] text-white">
                              Select Semester
                            </option>
                            <option value="1" className="bg-[#2A2A2F] text-white">
                              Semester 1
                            </option>
                            <option value="2" className="bg-[#2A2A2F] text-white">
                              Semester 2
                            </option>
                          </select>
                          <p className="mt-2 text-sm text-red-300">{errors.semester}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-200">Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              description: e.target.value,
                            })
                          }
                          rows="4"
                          className={`${inputClass} resize-none`}
                          placeholder="Add a short description about this resource"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-200">Lecturer Name *</label>
                        <input
                          value={form.lecturerName}
                          readOnly
                          className={readOnlyClass}
                        />
                        <p className="mt-2 text-sm text-red-300">{errors.lecturerName}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-white/15 bg-white/[0.07] p-5 md:p-6 backdrop-blur-xl">
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB06A]">
                        Attachment
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">
                        Upload Your File
                      </h3>
                    </div>

                    <div
                      className={`rounded-[28px] border-2 border-dashed p-8 md:p-10 text-center transition duration-300 ${
                        dragActive
                          ? "border-[#FF6A00] bg-[#FF6A00]/14 shadow-[0_0_35px_rgba(255,106,0,0.12)]"
                          : "border-white/20 bg-white/[0.05]"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#FF6A00]/20 bg-[#FF6A00]/12 text-4xl shadow-[0_0_30px_rgba(255,106,0,0.10)]">
                        📚
                      </div>

                      <p className="mt-5 text-lg font-semibold text-white">
                        Drag PDF, Video, ZIP, or RAR here
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Supported: PDF, MP4, MOV, AVI, MKV, WEBM, ZIP, RAR
                      </p>

                      <div className="mt-5">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff9d57] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,106,0,0.30)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_14px_35px_rgba(255,106,0,0.40)]">
                          Choose File
                          <input
                            type="file"
                            accept=".pdf,.mp4,.mov,.avi,.mkv,.webm,.zip,.rar,video/*,application/pdf,application/zip,application/x-rar-compressed"
                            className="hidden"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                          />
                        </label>
                      </div>

                      {file && (
                        <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/12 px-4 py-3 text-green-200">
                          Selected: {file.name}
                        </div>
                      )}

                      {!file && editingResource?.originalFileName && (
                        <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-gray-200">
                          Current file: {editingResource.originalFileName}
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-red-300">{errors.file}</p>
                  </section>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff9d57] py-4 text-base font-bold text-white shadow-[0_12px_35px_rgba(255,106,0,0.30)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(255,106,0,0.42)] disabled:opacity-60"
                  >
                    {loading ? "Saving..." : editingResource ? "Save Changes" : "Upload Resource"}
                  </button>

                  {success && (
                    <div className="rounded-2xl border border-green-400/20 bg-green-500/15 px-4 py-3 text-center text-green-100 backdrop-blur-xl">
                      {success}
                    </div>
                  )}
                </div>
              </form>

              {showRenameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                  <div className="w-full max-w-lg rounded-[28px] border border-white/15 bg-[#1F1F23]/95 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF6A00]">
                          Rename Attachment
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-white">
                          Edit file name before upload
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">
                          This renamed file name will be stored in the system and database.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={cancelRenameModal}
                        className="text-2xl text-gray-400 transition hover:text-white"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="text-sm text-gray-300">Selected File</label>
                        <div className="mt-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                          {pendingFile?.name}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-300">Rename As *</label>
                        <input
                          type="text"
                          value={customFileName}
                          onChange={(e) => setCustomFileName(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#FF6A00]/60 focus:ring-2 focus:ring-[#FF6A00]/25"
                          placeholder="Enter new attachment name"
                        />
                        {pendingFile && (
                          <p className="mt-2 text-xs text-gray-400">
                            Extension will remain: .{getFileExtension(pendingFile.name)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={cancelRenameModal}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={confirmRenameAndAttach}
                        className="rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#ff9d57] px-5 py-3 font-semibold text-white shadow-[0_10px_28px_rgba(255,106,0,0.28)] transition hover:scale-[1.02]"
                      >
                        Confirm Name
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}