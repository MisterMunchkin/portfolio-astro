import ReactSwiper from "@components/ui/ReactSwiper";
import type { WorkExperience } from "@content/config";
import WorkCard from "./WorkCard";

type Props = {
    experiences: WorkExperience[];
};

const WorkSwiper = ({ experiences }: Props) => {
    return (
        <div className="w-svw ">
            <ReactSwiper
                data={experiences}
                render={(experience) => <WorkCard work={experience} />}
            />
        </div>
    );
};

export default WorkSwiper;
