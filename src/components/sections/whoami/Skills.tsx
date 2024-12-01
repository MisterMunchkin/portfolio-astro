import { CONTENT } from "@constants/content";

type Props = {};

// Should be updated to use the content platform from Astro
const Skills = ({}: Props) => {
    return (
        <div className="flex flex-row justify-center items-start gap-20 gap-y-10 flex-wrap">
            {Object.entries(CONTENT.SKILLS).map(([key, skills], index) => (
                <div className="flex flex-col">
                    <h4
                        className="font-semibold text-amaranth-500 mb-2"
                        key={index}
                    >
                        {key}
                    </h4>
                    <div className="flex flex-col gap-1">
                        {skills.map((skill, index) => (
                            <>
                                <span
                                    key={index}
                                    className="font-medium text-star-dust-600"
                                >
                                    {skill.text} {skill.content}
                                </span>
                            </>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skills;
