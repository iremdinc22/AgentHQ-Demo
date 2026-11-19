import type { DepartmentId } from "../types";

type AgentPresentation = { accent: string; headline: string; prompts: readonly [string, string, string] };

export const agentPresentation: Record<DepartmentId, AgentPresentation> = {
  ceo: { accent: "#fae2d4", headline: "What shall we accomplish today?", prompts: ["Plan a new project", "Prioritize my tasks", "Review current progress"] },
  engineering: { accent: "#e7ebd5", headline: "What are we building today?", prompts: ["Review my project architecture", "Help me plan a new feature", "Create a testing strategy"] },
  research: { accent: "#eae2f4", headline: "What are we exploring today?", prompts: ["Analyze a new topic", "Summarize research papers", "Compare different approaches"] },
  content: { accent: "#f7dfe4", headline: "Let’s create something great.", prompts: ["Turn an idea into a draft", "Improve my writing", "Plan content for this week"] },
  career: { accent: "#faedce", headline: "Ready for your next career move?", prompts: ["Review my CV", "Prepare for an interview", "Find relevant opportunities"] },
  project: { accent: "#deebf7", headline: "Let’s turn ideas into plans.", prompts: ["Create a project plan", "Break down a feature", "Track project progress"] },
  knowledge: { accent: "#deefea", headline: "What would you like to learn today?", prompts: ["Explain a concept", "Create a learning plan", "Quiz me on this topic"] },
  game: { accent: "#eee2f8", headline: "Let’s make something fun!", prompts: ["Brainstorm a game idea", "Design a game feature", "Plan the next iteration"] },
};

const specializationIcons: Record<string, string> = {
  "Objective analysis": "target", Dependencies: "branch", "Result synthesis": "check",
  "Repository intelligence": "code", Architecture: "branch", Debugging: "search", Testing: "flask",
  "AI research": "flask", "Paper analysis": "book", "Technology comparisons": "activity",
  "Technical writing": "edit", "Medium drafts": "edit", "Editorial work": "check",
  "CV matching": "briefcase", "Interview preparation": "chat", "Career development": "flag",
  Milestones: "flag", Risks: "target", "Learning roadmaps": "branch", "Concept explanations": "book",
  Summarization: "tasks", "Game mechanics": "gamepad", "Level design": "branch", Unity: "code", "Gameplay UX": "gamepad",
};

export const specializationIcon = (label: string) => specializationIcons[label] ?? "spark";
