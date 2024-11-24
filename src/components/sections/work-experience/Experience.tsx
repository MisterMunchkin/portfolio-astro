import { CONTENT } from "@constants/content";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

type Props = {};

const Experience = ({}: Props) => {
    return (
        <div className="flex flex-col justify-center items-start gap-10 overflow-scroll">
            {CONTENT.EXPERIENCE.map(
                ({ company, points, timeline, title, website }, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-col items-start">
                            <p className="text-star-dust-300 ">
                                {title}
                                <a
                                    className="text-amaranth-500 inline-flex ml-2"
                                    href={website}
                                    target="_blank"
                                >{`@${company}`}</a>
                            </p>
                            <small className="text-star-dust-600">
                                {timeline}
                            </small>
                        </CardHeader>
                        <CardBody className="mt-2">
                            <div className="flex flex-col gap-4">
                                {points.map((point) => (
                                    <p className="text-star-dust-600">
                                        <span className="inline-flex text-amaranth-500 mr-2">
                                            {"→"}
                                        </span>
                                        {point}
                                    </p>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                )
            )}
        </div>
    );
};

export default Experience;
