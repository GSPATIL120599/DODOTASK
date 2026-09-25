export const products = {
  prod_123: {
    id: "prod_123",
    name: "Premium Developer Course",
    description:
      "Master modern full-stack development.",
    price: 49,
    currency: "USD",
  },

  prod_react: {
    id: "prod_react",
    name: "React Mastery",
    description:
      "Build production-ready React applications.",
    price: 39,
    currency: "USD",
  },

  prod_node: {
    id: "prod_node",
    name: "Node.js Backend Kit",
    description:
      "Learn APIs, authentication and backend architecture.",
    price: 45,
    currency: "USD",
  },

  prod_next: {
    id: "prod_next",
    name: "Next.js Pro",
    description:
      "Build modern applications with Next.js.",
    price: 59,
    currency: "USD",
  },

  prod_typescript: {
    id: "prod_typescript",
    name: "TypeScript Essentials",
    description:
      "Write safer and scalable JavaScript applications.",
    price: 29,
    currency: "USD",
  },

  prod_ui: {
    id: "prod_ui",
    name: "UI Design System",
    description:
      "Create polished and consistent product interfaces.",
    price: 35,
    currency: "USD",
  },

  prod_tailwind: {
    id: "prod_tailwind",
    name: "Tailwind CSS Workshop",
    description:
      "Build responsive interfaces faster with Tailwind.",
    price: 25,
    currency: "USD",
  },

  prod_git: {
    id: "prod_git",
    name: "Git & GitHub Pro",
    description:
      "Master professional Git workflows.",
    price: 19,
    currency: "USD",
  },

  prod_api: {
    id: "prod_api",
    name: "API Architecture Guide",
    description:
      "Design reliable REST APIs and integrations.",
    price: 32,
    currency: "USD",
  },

  prod_devops: {
    id: "prod_devops",
    name: "DevOps Starter Pack",
    description:
      "Learn Docker, CI/CD and deployment fundamentals.",
    price: 55,
    currency: "USD",
  },
} as const;

export type Product =
  (typeof products)[keyof typeof products];
  