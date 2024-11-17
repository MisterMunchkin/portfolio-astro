import "@css/animation-gradient-text.css";
import { cn } from "src/utils/cn";
import type { ClassValue } from "clsx";
import type { ReactNode } from "react";

type Props = {
    children: string;
    className?: ClassValue;
};

const GradientText = ({ className, children }: Props) => {
    return (
        <span className={cn("gradient-anim-right", className)}>{children}</span>
    );
};

export default GradientText;
