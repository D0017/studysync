import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UploadResource() {

  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const editingResource =
    JSON.parse(localStorage.getItem("editResource"));

  const moduleFromPage =
    location.state?.moduleName || "";

  const [form, setForm] = useState({
    title: editingResource?.title || "",
    module: editingResource?.module || moduleFromPage || "",
    year: editingResource?.year || "",
    semester: editingResource?.semester || "",
    lecturerName: storedUser?.fullName || ""
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);


  const validate = () => {

    let newErrors = {};

    if (!form.title || form.title.trim().length < 5)
      newErrors.title =
        "Title must contain at least 5 characters";

    if (!form.module)
      newErrors.module =
        "Module is required";

    if (!form.year)
      newErrors.year =
        "Year is required";

    if (!form.semester)
      newErrors.semester =
        "Semester is required";

    if (!editingResource && !file)
      newErrors.file =
        "PDF document required";

    if (file) {

      if (file.type !== "application/pdf")
        newErrors.file =
          "Only PDF files allowed";

      if (file.size < 2000)
        newErrors.file =
          "File must be larger than 2KB";

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };


  const convertToBase64 = file => {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);

  });
};


  const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validate()) return;

  const confirmUpload =
    window.confirm(
      "Are you sure you want to save this document?"
    );

  if (!confirmUpload) return;


  const allResources =
    JSON.parse(
      localStorage.getItem("resources")
    ) || [];


  let base64File = null;

  if (file) {

    base64File =
      await convertToBase64(file);

  }


  let updatedResources;


  if (editingResource) {

    updatedResources =
      allResources.map(r =>

        r.id === editingResource.id

          ? {

              ...r,

              title: form.title,

              module: form.module,

              year: form.year,

              semester: form.semester,

              fileName:
                file ? file.name : r.fileName,

              fileURL:
                file ? base64File : r.fileURL

            }

          : r

      );

  }

  else {

    const newResource = {

      id: Date.now(),

      title: form.title,

      module: form.module,

      year: form.year,

      semester: form.semester,

      lecturer: form.lecturerName,

      fileName: file.name,

      fileURL: base64File

    };

    updatedResources =
      [...allResources, newResource];

  }


  localStorage.setItem(

    "resources",

    JSON.stringify(updatedResources)

  );


  localStorage.removeItem("editResource");


  setSuccess(
    "Document saved successfully"
  );


  setTimeout(() => {

    navigate(-1);

  }, 1000);

};



  const handleFileChange =
    selectedFile => {

      setFile(selectedFile);

    };



  const handleDrag = e => {

    e.preventDefault();

    e.stopPropagation();

    if (

      e.type === "dragenter" ||

      e.type === "dragover"

    ) {

      setDragActive(true);

    }

    else {

      setDragActive(false);

    }

  };



  const handleDrop = e => {

    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    if (

      e.dataTransfer.files &&

      e.dataTransfer.files[0]

    ) {

      handleFileChange(

        e.dataTransfer.files[0]

      );

    }

  };



  return (

    <div className="min-h-screen bg-[#0A0A0C] flex justify-center items-center p-8">

      <form

        onSubmit={handleSubmit}

        className="bg-[#1F1F23] shadow-2xl border border-gray-800 rounded-2xl p-10 w-full max-w-2xl space-y-5 text-white"

      >

        <h2 className="text-3xl font-bold text-[#FF6A00]">

          {editingResource

            ? "Edit Resource"

            : "Upload Resource"}

        </h2>



        <div>

          <label className="text-sm text-gray-400">

            Resource Title *

          </label>

          <input

            value={form.title}

            onChange={(e)=>

              setForm({

                ...form,

                title:e.target.value

              })

            }

            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"

          />

          <p className="text-red-400 text-sm mt-1">

            {errors.title}

          </p>

        </div>



        <div>

          <label className="text-sm text-gray-400">

            Module *

          </label>

          <input

            value={form.module}

            onChange={(e)=>

              setForm({

                ...form,

                module:e.target.value

              })

            }

            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg"

          />

          <p className="text-red-400 text-sm mt-1">

            {errors.module}

          </p>

        </div>



        <div className="grid grid-cols-2 gap-4">

          <input

            placeholder="Year"

            value={form.year}

            onChange={(e)=>

              setForm({

                ...form,

                year:e.target.value

              })

            }

            className="bg-[#0A0A0C] border border-gray-700 p-3 rounded-lg"

          />



          <input

            placeholder="Semester"

            value={form.semester}

            onChange={(e)=>

              setForm({

                ...form,

                semester:e.target.value

              })

            }

            className="bg-[#0A0A0C] border border-gray-700 p-3 rounded-lg"

          />

        </div>



        <input

          value={form.lecturerName}

          readOnly

          className="bg-gray-900 border border-gray-700 p-3 w-full rounded-lg text-gray-400"

        />



        <div

          className={`

          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer

          ${dragActive

            ? "border-[#FF6A00]"

            : "border-gray-600"

          }

          `}

          onDragEnter={handleDrag}

          onDragLeave={handleDrag}

          onDragOver={handleDrag}

          onDrop={handleDrop}

        >

          Drag PDF here



          <input

            type="file"

            accept="application/pdf"

            onChange={(e)=>

              handleFileChange(

                e.target.files[0]

              )

            }

          />

        </div>



        <button

          className="bg-[#FF6A00] w-full py-3 rounded-xl"

        >

          Save

        </button>



        {success && (

          <div className="bg-green-500/20 p-3 rounded-lg text-center">

            {success}

          </div>

        )}

      </form>

    </div>

  );

}