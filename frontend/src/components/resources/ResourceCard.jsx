export default function ResourceCard({ resource }) {

    return (

        <div className="border p-4 rounded-lg shadow">

            <h3 className="font-semibold">
                {resource.title}
            </h3>

            <p>
                Module: {resource.module}
            </p>

            <p>
                Year: {resource.year}
            </p>

            <p>
                Uploaded By: {resource.uploadedBy}
            </p>

        </div>

    );

}