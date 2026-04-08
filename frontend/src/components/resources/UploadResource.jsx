import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import resourceService from "./resourceService";
import GlassBackButton from "../GlassBackButton";

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

    if (!editingResource && !file) {
      newErrors.file = "A file is required";
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
    setFile(selectedFile);
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
    : (storedUser?.role === "LECTURER"
        ? "/lecturer-dashboard"
        : storedUser?.role === "STUDENT"
        ? "/student-dashboard"
        : "/login");

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex justify-center items-center p-8">
      <div className="w-full max-w-2xl">
      <GlassBackButton to={backPath} label="Back" />

      <form
        onSubmit={handleSubmit}
        className="bg-[#1F1F23] shadow-2xl border border-gray-800 rounded-2xl p-10 w-full max-w-2xl space-y-5 text-white"
      >
        <h2 className="text-3xl font-bold text-[#FF6A00]">
          {editingResource ? "Edit Resource" : "Upload Resource"}
        </h2>

        {errors.api && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 p-3 rounded-lg text-center">
            {errors.api}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-400">Resource Title *</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"
          />
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        </div>

        <div>
          <label className="text-sm text-gray-400">Faculty *</label>
          <input
            value={form.faculty}
            onChange={(e) =>
              setForm({
                ...form,
                faculty: e.target.value,
              })
            }
            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"
          />
          <p className="text-red-400 text-sm mt-1">{errors.faculty}</p>
        </div>

        <div>
          <label className="text-sm text-gray-400">Module *</label>
          <input
            value={form.module}
            onChange={(e) =>
              setForm({
                ...form,
                module: e.target.value,
              })
            }
            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"
          />
          <p className="text-red-400 text-sm mt-1">{errors.module}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Year *</label>
            <input
              value={form.year}
              onChange={(e) =>
                setForm({
                  ...form,
                  year: e.target.value,
                })
              }
              className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"
            />
            <p className="text-red-400 text-sm mt-1">{errors.year}</p>
          </div>

          <div>
            <label className="text-sm text-gray-400">Semester *</label>
            <input
              value={form.semester}
              onChange={(e) =>
                setForm({
                  ...form,
                  semester: e.target.value,
                })
              }
              className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"
            />
            <p className="text-red-400 text-sm mt-1">{errors.semester}</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            rows="3"
            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Lecturer Name *</label>
          <input
            value={form.lecturerName}
            readOnly
            className="mt-1 bg-gray-900 border border-gray-700 p-3 w-full rounded-lg text-gray-400"
          />
          <p className="text-red-400 text-sm mt-1">{errors.lecturerName}</p>
        </div>

        <div
          className={`
            border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
            ${dragActive ? "border-[#FF6A00] bg-[#FF6A00]/10" : "border-gray-600"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <p className="text-gray-300 font-medium">
            Drag PDF, Video, ZIP, or RAR here
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Supported: PDF, MP4, MOV, AVI, MKV, WEBM, ZIP, RAR
          </p>

          <input
            type="file"
            accept=".pdf,.mp4,.mov,.avi,.mkv,.webm,.zip,.rar,video/*,application/pdf,application/zip,application/x-rar-compressed"
            className="mt-4 block mx-auto text-sm"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          {file && (
            <p className="mt-3 text-green-400">
              Selected: {file.name}
            </p>
          )}

          {!file && editingResource?.originalFileName && (
            <p className="mt-3 text-gray-400">
              Current file: {editingResource.originalFileName}
            </p>
          )}
        </div>

        <p className="text-red-400 text-sm">{errors.file}</p>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF6A00] w-full py-3 rounded-xl disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {success && (
          <div className="bg-green-500/20 p-3 rounded-lg text-center">
            {success}
          </div>
        )}
      </form>
    </div>
    </div>
  );
}