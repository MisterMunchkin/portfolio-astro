type TopNavBarItems = {
    text: string;
    link: string;
};

const topNavBarItems: TopNavBarItems[] = [
    {
        text: "Whoami?",
        link: "",
    },
    {
        text: "Body of Work",
        link: "",
    },
    {
        text: "On the Side",
        link: "",
    },
    {
        text: "Hit me Up",
        link: "",
    },
    {
        text: "Resume",
        link: "",
    },
];

const TopNavBar = () => {
    return (
        <div className="fixed px-2 py-4 flex-row justify-between items-center">
            <a className="text-amaranth-500 ">ROBIN DALMY</a>
        </div>
    );
};

export default TopNavBar;
