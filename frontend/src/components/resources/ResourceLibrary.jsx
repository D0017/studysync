import { useEffect, useState } from "react";
import resourceService from "./resourceService";
import ResourceCard from "./ResourceCard";

export default function ResourceLibrary() {

    const [resources, setResources] = useState([]);

    useEffect(() => {

        fetchResources();

    }, []);

    const fetchResources = async () => {

        const data = await resourceService.getAllResources();

        setResources(data);

    };

    return (

        <div className="p-6">

            <h2 className="text-2xl font-bold mb-4">
                Resource Library
            </h2>

            <div className="grid gap-4">

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