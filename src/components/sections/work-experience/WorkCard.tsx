import type { WorkExperience } from "@content/config";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "astro:assets";

type Props = {
    work: WorkExperience;
};

/**
 * Add view transitions and keep the card
 * for the details page
 */
const WorkCard = ({ work }: Props) => {
    const { company, timeline, title, points, website } = work;

    return (
        <Card className="bg-shark-950 max-h-96 px-4 py-2">
            <CardHeader className="flex flex-col items-start">
                <p className="text-star-dust-300 ">
                    {title}
                    <a
                        className="text-amaranth-500 inline-flex ml-2"
                        href={website}
                        target="_blank"
                    >{`@${company}`}</a>
                </p>
                <small className="text-star-dust-600">{timeline}</small>
            </CardHeader>
            <CardBody className="mt-2 flex flex-col gap-4 ">
                {points.map((point, index) => (
                    <p
                        key={index}
                        className="text-star-dust-400 indent-4 text-pretty"
                    >
                        <span className="inline-flex text-amaranth-500 mr-2">
                            {"→"}
                        </span>
                        {point}
                    </p>
                ))}
            </CardBody>
        </Card>
    );
};

export default WorkCard;
