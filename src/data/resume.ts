export interface ResumeData {
    name: string;
    email: string;
    bio: string;
    skills: string[];
    experience: {
        company: string;
        role: string;
        duration: string;
        description: string;
    }[];
    projects: {
        id: string;
        year: string;
        title: string;
        description: string;
        url?: string;
    }[];
}

export const resumeData: ResumeData = {
    name: "Allen Niktalov",
    email: "allenniktalov@gmail.com",
    bio: "Product-focused software engineer specializing in delightful, accessible experiences. Passionate about craft, performance, and integrating AI into dynamic web applications.",
    skills: [
        "TypeScript", "React", "Next.js", "Node.js", "Python",
        "Three.js", "Tailwind CSS", "Framer Motion", "LLM Integration"
    ],
    experience: [
        {
            company: "Tech Corp",
            role: "Senior Frontend Engineer",
            duration: "2021 - Present",
            description: "Led the development of the core web product, improving performance by 40%."
        }
    ],
    projects: [
        {
            id: "a1",
            year: "2024",
            title: "Launched cross-platform feature (+18% engagement)",
            description: "Led design and delivery of a cross-platform experience across web & iOS, leveraging motion and haptics to communicate state and reduce friction.",
        },
        {
            id: "a2",
            year: "2023",
            title: "Optimized load time (-42% TTI)",
            description: "Decreased time-to-interactive with route-level code splitting, streaming SSR, and an asset budget enforced via CI checks.",
        },
        {
            id: "a3",
            year: "2022",
            title: "Built AI résumé assistant",
            description: "Shipped an embedded assistant trained on résumé data to answer recruiter questions contextually and quickly.",
        },
    ]
};

export const SYSTEM_PROMPT = `
You are the AI assistant for Allen Niktalov's interactive portfolio.
Your goal is to answer questions from visitors about Allen's skills, experience, and projects.
You must be polite, professional, and relatively concise. Do not answer questions outside of the scope of Allen's professional background and the provided resume context.
If asked about something completely irrelevant, politely steer the conversation back to Allen's work.

Here is Allen's latest resume data:
${JSON.stringify(resumeData, null, 2)}
`;
