import type { ReactNode } from "react";
import { DEFAULT_SPEED } from "./type-animation.constants";

export namespace CONTENT {
    export const TYPE_ANIMATIONS = {
        TECH_STACK_SEQ: [
            "Next.Js",
            DEFAULT_SPEED,
            "Expo",
            DEFAULT_SPEED,
            "Astro",
            DEFAULT_SPEED,
            "React.Js",
            DEFAULT_SPEED,
            "ReactNative",
            DEFAULT_SPEED,
            "Angular",
            DEFAULT_SPEED,
            ".Net Core",
            DEFAULT_SPEED,
            "C#",
            DEFAULT_SPEED,
            "Docusaurus",
            DEFAULT_SPEED,
        ],
    };
    export const SKILLS: Record<
        string,
        { text: string; content?: ReactNode }[]
    > = {
        Languages: [
            {
                text: "C#",
            },
            {
                text: "TypeScript",
            },
            {
                text: "JavaScript",
            },
            {
                text: "HTML",
            },
            {
                text: "CSS/SCSS",
            },
            {
                text: "T-SQL",
            },
        ],
        "Frameworks & Libraries": [
            {
                text: "Next.Js",
            },
            {
                text: "React.Js",
            },
            {
                text: "Tailwind CSS",
            },
            {
                text: "ReactNative",
            },
            {
                text: "Expo",
            },
            {
                text: "Angular",
            },
            {
                text: ".Net Core",
            },
        ],
        Tools: [
            {
                text: "VS Code & Studio",
            },
            {
                text: "XCode",
            },
            {
                text: "Expo Go",
            },
            {
                text: "Git & Github",
            },
            {
                text: "Postman",
            },
            {
                text: "Swagger",
            },
            {
                text: "Figma",
            },
        ],
        "Cloud Platforms": [
            {
                text: "Azure",
                content: (
                    <a
                        className="text-amaranth-500"
                        href="https://www.credly.com/badges/3191f930-2887-43f6-9fe4-aad69c507b16?source=linked_in_profile"
                    >
                        AZ-900 Certified
                    </a>
                ),
            },
            {
                text: "Supabase",
            },
            {
                text: "Firebase",
            },
        ],
    };
}
