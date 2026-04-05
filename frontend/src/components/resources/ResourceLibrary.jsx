import { useEffect, useState } from "react";
import resourceService from "./resourceService";
import ResourceCard from "./ResourceCard";

export default function ResourceLibrary() {

    const [resources, setResources] = useState([]);

    useEffect(() => {

        fetchResources();

    }, []);

    const fetchResources = async () => {

        const data =
            await resourceService.getAllResources();

        setResources(data);

    };

    return (

        <div className="min-h-screen bg-[#F4F4F6]">

            <div className="bg-[#1F1F23] text-white py-16 text-center">

                <h2 className="text-3xl font-bold">

                    Resource Library

                </h2>

                <p className="text-gray-400 mt-2">

                    All uploaded materials

                </p>

            </div>


            <div className="max-w-4xl mx-auto py-12 px-6 grid gap-5">

                {resources.map(resource => (

                    <ResourceCard

                        key={resource.id}

                        resource={resource}

                    />

                ))}

            </div>

        </div>

    );

}