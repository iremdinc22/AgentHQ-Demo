import { officeLayout } from "./officeLayout";
import type { Department } from "../types";
export const departments: Department[] = [
  {
    id: "ceo",
    name: "CEO Office",
    animal: "Fox",
    emoji: "🦊",
    color: officeLayout.ceo.wall,
    position: officeLayout.ceo.position,
    description:
      "Your big-picture partner. Turns an idea into a plan and brings the right minds together.",
    specialty: "Orchestration & delegation",
  },
  {
    id: "engineering",
    name: "Engineering Lab",
    animal: "Raccoon",
    emoji: "🦝",
    color: officeLayout.engineering.wall,
    position: officeLayout.engineering.position,
    description:
      "A curious builder for thoughtful architecture, clean code, and tricky problems.",
    specialty: "Software engineering",
  },
  {
    id: "research",
    name: "Research Lab",
    animal: "Owl",
    emoji: "🦉",
    color: officeLayout.research.wall,
    position: officeLayout.research.position,
    description: "Follows the evidence, checks sources, and connects the dots.",
    specialty: "Research & verification",
  },
  {
    id: "content",
    name: "Content Studio",
    animal: "Rabbit",
    emoji: "🐰",
    color: officeLayout.content.wall,
    position: officeLayout.content.position,
    description:
      "Finds the right words for technical ideas and stories worth sharing.",
    specialty: "Writing & content",
  },
  {
    id: "career",
    name: "Career Office",
    animal: "Golden Retriever",
    emoji: "🐕",
    color: officeLayout.career.wall,
    position: officeLayout.career.position,
    description:
      "A friendly partner for your next chapter, from resumes to interviews.",
    specialty: "Career management",
  },
  {
    id: "project",
    name: "Project Office",
    animal: "Penguin",
    emoji: "🐧",
    color: officeLayout.project.wall,
    position: officeLayout.project.position,
    description:
      "Gives ambitious ideas a timeline, a next step, and room to grow.",
    specialty: "Planning & coordination",
  },
  {
    id: "knowledge",
    name: "Knowledge Hub",
    animal: "Cat",
    emoji: "🐈",
    color: officeLayout.knowledge.wall,
    position: officeLayout.knowledge.position,
    description:
      "A quiet home for shared context, useful notes, and lasting knowledge.",
    specialty: "Knowledge & memory",
  },
  {
    id: "game",
    name: "Game Studio",
    animal: "Red Panda",
    emoji: "🐾",
    color: officeLayout.game.wall,
    position: officeLayout.game.position,
    description:
      "Dreams up playful worlds and turns mechanics into memorable experiences.",
    specialty: "Game design & production",
  },
];
export const departmentById = Object.fromEntries(
  departments.map((d) => [d.id, d]),
) as Record<Department["id"], Department>;
