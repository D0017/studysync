import { useState } from "react";
import resourceService from "./resourceService";

export default function UploadResource() {

    const [form, setForm] = useState({

        title: "",
        module: "",
        year: "",
        faculty: "",
        uploadedBy: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await resourceService.createResource(form);

        alert("Resource Added");

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="p-6 space-y-3"
        >

            <input
                name="title"
                placeholder="Title"
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <input
                name="module"
                placeholder="Module"
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <input
                name="year"
                placeholder="Year"
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <input
                name="faculty"
                placeholder="Faculty"
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <input
                name="uploadedBy"
                placeholder="Lecturer Name"
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >

                Upload

            </button>

        </form>

    );

}