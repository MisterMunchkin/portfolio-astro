import type { ComponentProps } from "react";
import NavItem from "./Item";

const topNavBarItems: ComponentProps<typeof NavItem>[] = [
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
        link: "/pdfs/Robin-Dalmy_Resume_15-11-2024.pdf",
        target: "_blank",
    },
];

const TopNavBar = () => {
    return (
        <div className="z-50 fixed px-3 py-4 flex flex-row justify-between items-center glass-effect w-full">
            <a className="text-amaranth-500 font-black text-xl" href="/">
                Robin Dalmy
            </a>
            <div className="flex flex-row gap-8 items-center">
                {topNavBarItems.map(({ link, text, target }, index) => (
                    <NavItem
                        key={index}
                        link={link}
                        text={text}
                        target={target}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopNavBar;
