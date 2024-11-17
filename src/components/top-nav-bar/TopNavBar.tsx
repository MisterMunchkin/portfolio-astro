import type { ComponentProps } from "react";
import NavItem from "./Item";
import type { ClassValue } from "clsx";
import { cn } from "@utils/cn";

const topNavBarItems: ComponentProps<typeof NavItem>[] = [
    {
        text: "Resume",
        link: "/pdfs/Robin-Dalmy_Resume_15-11-2024.pdf",
        target: "_blank",
    },
    {
        text: "Blog",
        link: "https://blog.robindalmy.com",
        target: "_blank",
    },
];

type Props = {
    className?: ClassValue;
};
const TopNavBar = ({ className }: Props) => {
    return (
        <div
            className={cn(
                "z-50 fixed px-3 md:px-10 py-4 flex flex-row justify-between items-center glass-effect w-full h-16",
                className
            )}
        >
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
