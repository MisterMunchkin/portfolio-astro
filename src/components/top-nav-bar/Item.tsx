import type { HTMLAttributeAnchorTarget } from "react";

type Props = {
    text: string;
    link: string;
    target?: HTMLAttributeAnchorTarget;
};

const NavItem = ({ link, text, target }: Props) => {
    return (
        <a
            target={target}
            href={link}
            className="text-star-dust-500 font-semibold hover:text-amaranth-500 hover:scale-110 transition duration-300"
        >
            {text}
        </a>
    );
};

export default NavItem;
