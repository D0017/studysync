export default function ResourceCard({ resource }) {

    return (

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition">

            <h3 className="font-semibold text-gray-800">

                {resource.title}

            </h3>

            <div className="text-sm text-gray-500 mt-2 space-y-1">

                <p>Module: {resource.module}</p>

                <p>Year: {resource.year}</p>

                <p>Uploaded By: {resource.uploadedBy}</p>

            </div>

        </div>

    );

}