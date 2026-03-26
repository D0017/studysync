import { useState } from "react";
import { useNavigate } from "react-router-dom";
    

export default function UploadResource() {

const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({

    title: "",

    module: "",

    year: "",

    semester: "",

    lecturerName: storedUser?.fullName || ""

  });

  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});

  const [success, setSuccess] = useState("");

  const [dragActive, setDragActive] = useState(false);



  const validate = () => {

    let newErrors = {};

    if (!form.title || form.title.trim().length < 5)

      newErrors.title = "Title must contain at least 5 characters";

    if (!form.module)

      newErrors.module = "Module is required";

    if (!form.year)

      newErrors.year = "Year is required";

    if (!form.semester)

      newErrors.semester = "Semester is required";

    if (!form.lecturerName)

      newErrors.lecturerName = "Lecturer name missing";



    if (!file)

      newErrors.file = "PDF document required";

    else {

      if (file.type !== "application/pdf")

        newErrors.file = "Only PDF files allowed";



      if (file.size < 2000)

        newErrors.file = "File must be larger than 2KB";

    }



    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };



  const handleSubmit = (e) => {

    e.preventDefault();



    if (!validate()) return;



    const confirmUpload = window.confirm(

      "Are you sure you want to upload this document?"

    );



    if (!confirmUpload) return;



    setSuccess("Document uploaded successfully");

    setTimeout(() => {

    navigate("/resources");

    }, 1000);

  };



  const handleFileChange = (selectedFile) => {

    setFile(selectedFile);

  };



  const handleDrag = (e) => {

    e.preventDefault();

    e.stopPropagation();



    if (e.type === "dragenter" || e.type === "dragover") {

      setDragActive(true);

    } else if (e.type === "dragleave") {

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



  return (

    <div className="min-h-screen bg-[#0A0A0C] flex justify-center items-center p-8">

      <form

        onSubmit={handleSubmit}

        className="bg-[#1F1F23] shadow-2xl border border-gray-800 rounded-2xl p-10 w-full max-w-2xl space-y-5 text-white"

      >

        <h2 className="text-3xl font-bold text-[#FF6A00]">

          Upload Resource

        </h2>



        <div>

          <label className="text-sm text-gray-400">

            Resource Title *

          </label>

          <input

            placeholder="Eg: ITPM Past Paper 2024"

            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#FF6A00] outline-none"

            onChange={(e)=>setForm({...form,title:e.target.value})}

          />

          <p className="text-red-400 text-sm mt-1">{errors.title}</p>

        </div>



        <div>

          <label className="text-sm text-gray-400">

            Module *

          </label>

          <input

            placeholder="Eg: ITPM"

            className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#FF6A00] outline-none"

            onChange={(e)=>setForm({...form,module:e.target.value})}

          />

          <p className="text-red-400 text-sm mt-1">{errors.module}</p>

        </div>



        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="text-sm text-gray-400">

              Year *

            </label>

            <input

              placeholder="Eg: 2"

              className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#FF6A00] outline-none"

              onChange={(e)=>setForm({...form,year:e.target.value})}

            />

            <p className="text-red-400 text-sm mt-1">{errors.year}</p>

          </div>



          <div>

            <label className="text-sm text-gray-400">

              Semester *

            </label>

            <input

              placeholder="Eg: 1"

              className="mt-1 bg-[#0A0A0C] border border-gray-700 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#FF6A00] outline-none"

              onChange={(e)=>setForm({...form,semester:e.target.value})}

            />

            <p className="text-red-400 text-sm mt-1">{errors.semester}</p>

          </div>

        </div>



        <div>

          <label className="text-sm text-gray-400">

            Lecturer Name *

          </label>

          <input

            value={form.lecturerName}

            readOnly

            className="mt-1 bg-gray-900 border border-gray-700 p-3 w-full rounded-lg text-gray-300"

          />

          <p className="text-red-400 text-sm mt-1">{errors.lecturerName}</p>

        </div>



        {/* drag drop area */}

        <div

          className={`

          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer

          transition

          ${dragActive ? "border-[#FF6A00] bg-[#FF6A00]/10" : "border-gray-600"}

          `}

          onDragEnter={handleDrag}

          onDragLeave={handleDrag}

          onDragOver={handleDrag}

          onDrop={handleDrop}

        >

          <p className="text-gray-300">

            Drag & drop PDF here

          </p>



          <p className="text-sm text-gray-500 mt-2">

            or click to browse

          </p>



          <input

            type="file"

            accept="application/pdf"

            className="hidden"

            id="fileUpload"

            onChange={(e)=>handleFileChange(e.target.files[0])}

          />



          <label

            htmlFor="fileUpload"

            className="text-[#FF6A00] underline cursor-pointer"

          >

            Choose File

          </label>



          {file && (

            <p className="mt-3 text-green-400">

              Selected: {file.name}

            </p>

          )}

        </div>



        <p className="text-red-400 text-sm">{errors.file}</p>



        <button

          className="bg-[#FF6A00] hover:bg-orange-600 text-white w-full py-3 rounded-xl font-semibold shadow-lg transition"

        >

          Upload Document

        </button>


        {success && (

            <div className="mt-4 bg-green-500/20 border border-green-400 text-green-300 p-3 rounded-lg text-center">

                {success}

            </div>

        )}

      </form>

    </div>

  );

}