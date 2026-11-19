import { create } from "zustand";
import { scenarios } from "../../data/scenarios";

type ProjectInput = { name: string; description: string };
type Project = ProjectInput & { id: string; created_at: string; updated_at: string };

export const useProjectsStore = create<{
  projects: Project[];
  refresh: () => void;
  save: (input: ProjectInput) => Project;
}>(set => ({
  projects: scenarios.map((scenario, index) => ({
    id: scenario.id,
    name: scenario.project.split(" · ")[0],
    description: scenario.goal,
    created_at: new Date(Date.UTC(2026, 0, 3 - index)).toISOString(),
    updated_at: new Date(Date.UTC(2026, 0, 3 - index)).toISOString(),
  })),
  refresh: () => set(state => ({ projects: [...state.projects] })),
  save: input => {
    const now = new Date().toISOString();
    const project = { ...input, id: crypto.randomUUID(), created_at: now, updated_at: now };
    set(state => ({ projects: [project, ...state.projects] }));
    return project;
  },
}));
