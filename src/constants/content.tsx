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
    export const EXPERIENCE = [
        {
            title: "Front End Engineer",
            company: "Moonward",
            timeline: "June 2024 - Present",
            website: "https://www.moonward.com.au",
            points: [
                "Developed applications leveraging ReactJs, NextJs, ReactNative, and Expo",
                "Leveraging highly performant caching and state-management software such as Tanstack and Zustand",
                "Collaborated with teammates to create highly reusable UI components, streamlining efficiency and greatly improving Developer Experience",
                "Regularly presented application progress to clients, gathering feedback and aligning project goals",
            ],
        },
        {
            title: "Senior Software Developer",
            company: "AMCS Group",
            timeline: "February 2023 - January 2024",
            website: "https://www.amcsgroup.com/",
            points: [
                "Developed rich user interactive web applications with specialization in Angular Development",
                "Designed and developed various features with rich user interactivity centered around Maps using Leaflet.Js and AG Grid. Resulted in significantly enhanced user interaction and advanced application usability",
                "Conceptualized and authored reusable and maintainable Angular Components, Services, and Directives resulting in reusability for core components across new features",
                "Expanded and coordinated Test Driven Development in Angular and .Net using Jasmine, Gherkin, and SpecFlow. This led to an increase in Unit and Integration test cases for new features and fixes",
                "Collaborated heavily with teammates on code design and maintainability streamlining updates and fixes due to the rehabilitated coding structure",
                "Explored and refactored Angular RxJs logic within various components and services diminishing potential memory leaks and improved maintainability within the application",
            ],
        },
        {
            title: "Full Stack C# Developer",
            company: "CoDev",
            timeline: "July 2021 - February 2023",
            website: "https://codev.com",
            points: [
                "Worked as a Full Stack C#, Angular, iOS and Android developer for my client",
                "Enabled mobile access for HID readers by ejecting an Expo app to implement and integrate a third party SDK in both iOS and Android, exposing the functionality to React Native using React Native Modules.",
                "Improved startup efficiency by up to 25% for their user-facing application by optimizing the Angular NgRx store and RxJs.",
                "Worked with a team of 3 Full Stack Developers, the CTO and Senior Architect in conceptualization, design, and development to build several user-facing, robust, and maintainable features using Angular, .Net Core, and Entity Framework Core migrations for the web, and React-Native, Expo, iOS, and Android for mobile",
                "Implemented optimizations for client-side image caching in Angular, which improved loading times by 60%.",
                "Modernized the UI UX of the older features using SCSS.",
            ],
        },
        {
            title: "Application Developer",
            company: "Accenture",
            timeline: "April 2019 - July 2021",
            website: "https://www.accenture.com/ph-en",
            points: [
                "Absorbed into Accenture from Vertere, and was also recruited for a project that used Python, Machine Learning, and RPAs to automate technical support workflows for an external client",
                "Received Azure Fundamentals (AZ-900) certification in October 2020",
                "Led and implemented Logic Apps to offload heavy tasks from our service which led to a significant performance boost",
                "Initiated and maintained our GIT branching strategy and Continuous Integration (CI)/Continuous Development (CD) which increased our release efficiency",
                "Built an Error handling implementation in our APIs that reduced duplicate code throughout our service by up to 40%",
                "Created and implemented automation workflows and implemented Automation Anywhere",
                "Created and implemented python scripts to handle more complex data sets for the workflows",
            ],
        },
        {
            title: "Application Developer",
            company: "Vertere",
            timeline: "April 2018 - April 2019",
            website: "https://www.vertere-gs.com",
            points: [
                "Contracted for Accenture where I worked as a Full Stack developer using ASP.Net, AngularJs, T-SQL. I also designed and deployed several Azure Cloud Services, and designed and implemented Azure DevOps CI/CD pipeline",
                "Built several robust and maintainable features that helped employees and project managers deal with their onboarding/offboarding more efficiently",
                "Led the team on optimizing various features due to the increase in projects which brought loading times down to 83%",
                "Led team in creating the production instance of both our AppService and SendGrid implementation",
                "Initiated and led the team onto utilizing Azure Slot Deployment setup. This decreased warm-up times from 3 minutes to less than 30 seconds and made the app highly available",
                "Initiated and implemented various architecture optimizations, and security enhancements to follow industry-standard principles like SOLID and DRY",
            ],
        },
    ];
}
