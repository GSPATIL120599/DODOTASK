export type DemoProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

export const demoProducts: DemoProduct[] = [
  {
    id: "prod_123",
    name: "Premium Developer Course",
    description:
      "Master modern full-stack development.",
    price: 49,
    category: "Courses",
  },
  {
    id: "prod_react",
    name: "React Mastery",
    description:
      "Build production-ready React applications.",
    price: 39,
    category: "Courses",
  },
  {
    id: "prod_node",
    name: "Node.js Backend Kit",
    description:
      "Learn APIs, authentication and backend architecture.",
    price: 45,
    category: "Courses",
  },
  {
    id: "prod_next",
    name: "Next.js Pro",
    description:
      "Build modern applications with Next.js.",
    price: 59,
    category: "Courses",
  },
  {
    id: "prod_typescript",
    name: "TypeScript Essentials",
    description:
      "Write safer and scalable JavaScript applications.",
    price: 29,
    category: "Courses",
  },
  {
    id: "prod_ui",
    name: "UI Design System",
    description:
      "Create polished and consistent product interfaces.",
    price: 35,
    category: "Design",
  },
  {
    id: "prod_tailwind",
    name: "Tailwind CSS Workshop",
    description:
      "Build responsive interfaces faster with Tailwind.",
    price: 25,
    category: "Courses",
  },
  {
    id: "prod_git",
    name: "Git & GitHub Pro",
    description:
      "Master professional Git workflows.",
    price: 19,
    category: "Developer Tools",
  },
  {
    id: "prod_api",
    name: "API Architecture Guide",
    description:
      "Design reliable REST APIs and integrations.",
    price: 32,
    category: "Developer Tools",
  },
  {
    id: "prod_devops",
    name: "DevOps Starter Pack",
    description:
      "Learn Docker, CI/CD and deployment fundamentals.",
    price: 55,
    category: "Developer Tools",
  },
];
