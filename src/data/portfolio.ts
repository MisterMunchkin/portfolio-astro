// Historical source dates remain in src/content/work-experiences.
// Reconcile them only after confirmation; these summaries omit disputed dates.
export const projects = [
  {
    slug: "mobile-native",
    number: "01",
    category: "Mobile engineering",
    title: "Beyond the browser.",
    subtitle: "Connecting React Native to the native platform.",
    summary:
      "Taking an Expo application into native iOS and Android to integrate a third-party mobile access SDK.",
    tags: ["React Native", "Expo", "iOS & Android"],
    visual: "mobile",
    context: "CoDev · Selected engineering work",
    intro:
      "Some mobile features need to reach beyond JavaScript. At CoDev, I worked on mobile access for HID readers, integrating a third-party SDK with an Expo application on both iOS and Android.",
    sections: [
      {
        title: "The platform boundary",
        text: "The application needed native mobile access functionality. That meant moving the Expo app into native iOS and Android projects and making the third-party SDK available to the React Native layer.",
      },
      {
        title: "My contribution",
        text: "I integrated the SDK on both mobile platforms and exposed its functionality through React Native modules. The work sat alongside full-stack feature development across Angular, .NET Core, and Entity Framework Core.",
      },
      {
        title: "Why this work matters to me",
        text: "I enjoy working across the boundary between a shared interface and the platform underneath it. This is the kind of problem that makes mobile engineering interesting: understanding where the abstraction ends and how to connect the next piece.",
      },
    ],
    note: "Focus: native platform integration, shared application code, and full-stack feature development.",
  },
  {
    slug: "agent-workflows",
    number: "02",
    category: "Agentic engineering · CareVicinity",
    title: "Build the way you build.",
    subtitle: "Tools that make agent work more deliberate.",
    summary:
      "Exploring agent harnesses, reusable skills, and human feedback loops with Codex and Claude.",
    tags: ["Codex & Claude", "Harnesses", "MCP-style servers"],
    visual: "agents",
    context: "CareVicinity · Agentic engineering",
    intro:
      "At CareVicinity, I build development tooling around Codex and Claude: agent harnesses, reusable skills, planning and orchestration, and MCP-style servers. The interesting part is shaping how people and agents work together.",
    sections: [
      {
        title: "Make the plan reviewable",
        text: "My workflows include human comments on agent plans. A plan becomes a place to discuss intent and guide the next step, with people able to contribute before implementation moves forward.",
      },
      {
        title: "Give the workflow reusable pieces",
        text: "I work on harnesses, reusable skills, and orchestration so recurring development activities have a structure to build on. My custom workspace builds on BB.",
      },
      {
        title: "Bring more people into the codebase",
        text: "Another area I work on is enabling designers to prototype directly from the mobile codebase. I’m interested in making the real product a more useful place to explore an idea.",
      },
    ],
    note: "Focus: development tooling, deliberate planning, and human feedback in agent-assisted workflows.",
  },
  {
    slug: "shared-interfaces",
    number: "03",
    category: "Web & product engineering",
    title: "Interfaces, with a system.",
    subtitle: "Reusable foundations for product teams.",
    summary:
      "Building reusable UI across React and Angular, with attention to state, maintainability, and collaboration.",
    tags: ["React & Next.js", "Angular", "State management"],
    visual: "web",
    context: "Moonward & AMCS Group · Selected engineering work",
    intro:
      "Across product teams, I’ve worked on interfaces that need to be useful today and maintainable as features evolve. That has included reusable UI in React and Angular, state management, and interactive mapping features.",
    sections: [
      {
        title: "Reusable UI in product work",
        text: "At Moonward, I developed applications using React, Next.js, React Native, and Expo. I collaborated on reusable UI components and worked with TanStack and Zustand for caching and state management.",
      },
      {
        title: "Interactive applications",
        text: "At AMCS Group, I worked on Angular features using Leaflet.js and AG Grid. I also authored reusable components, services, and directives, and refactored RxJS logic to improve maintainability.",
      },
      {
        title: "Work beyond the component",
        text: "The work also involved collaborating on code design, expanding testing practices, and presenting application progress to clients. I value the conversations around an interface as much as the code that renders it.",
      },
    ],
    note: "A thematic overview of separate roles at Moonward and AMCS Group.",
  },
];
type EarlierExperience = {
  company: string;
  title: string;
  detail: string;
  summary?: string;
};

export const earlierExperience: EarlierExperience[] = [
  {
    company: "Moonward",
    title: "Front End Engineer",
    detail: "React, Next.js, React Native & Expo",
    summary:
      "Product development and production troubleshooting across web and mobile applications.",
  },
  {
    company: "Independent consulting",
    title: "Independent consultant",
    detail: "Occasional paid consulting · Jan–Jul 2024",
    summary:
      ".NET and Angular feature development, debugging, and development-lifecycle advice for waste and route-management companies, drawing on earlier AMCS experience.",
  },
  {
    company: "AMCS Group",
    title: "Senior Software Developer",
    detail: "Angular, interactive maps & .NET",
  },
  {
    company: "CoDev",
    title: "Full Stack C# Developer",
    detail: "Web, native integrations & mobile",
  },
  {
    company: "Accenture",
    title: "Application Developer",
    detail: "Joined directly following the Vertere contract",
    summary: "Azure deployment-slot work during direct Accenture employment.",
  },
  {
    company: "Vertere",
    title: "Application Developer",
    detail: "Contracted to work at Accenture",
  },
];
export const toolkit = [
  {
    title: "Mobile",
    tools: "React Native · Expo · EAS · EAS Update · iOS · Android",
  },
  {
    title: "Web & backend",
    tools: "TypeScript · React · Next.js · Angular · .NET · PHP · Laravel Herd",
  },
  {
    title: "Product & delivery",
    tools: "Sentry · Amplitude · Intercom · Git · Azure",
  },
  {
    title: "Agent tooling",
    tools: "Codex · Claude · Harnesses · Skills · MCP-style servers",
  },
];
