import { departmentById } from "../departments/config";
import type { DepartmentId, ExecutionAdapter } from "../types";
import { pause } from "./mockExecution";

type Step = { agent: DepartmentId; action: string; result: string };
type Scenario = { id: string; title: string; project: string; goal: string; stages: Step[][] };

export const scenarios: Scenario[] = [
  {
    id: "software", title: "Software project review", project: "Fernboard · fictional issue tracker",
    goal: "Review the fictional Fernboard issue tracker and outline a development plan.",
    stages: [
      [{ agent: "engineering", action: "Review the sample architecture", result: "The fictional app has two modules. Its sample backlog flags validation for new issue titles." }],
      [{ agent: "project", action: "Turn findings into milestones", result: "Plan three milestones: define the validation rules, add example cases, and review the flow." }],
      [{ agent: "content", action: "Draft the review outline", result: "Suggested report: architecture summary, validation gap, proposed milestones, and open questions." }],
    ],
  },
  {
    id: "research", title: "Research article preparation", project: "Lantern Library · fictional reading room",
    goal: "Prepare an article outline from synthetic Lantern Library materials.",
    stages: [
      [
        { agent: "research", action: "Compare fictional source cards", result: "Two synthetic sources present different views on community reading spaces." },
        { agent: "knowledge", action: "Find relevant sample notes", result: "The fictional archive contains an example note on quiet hours and another on shared reading groups." },
      ],
      [{ agent: "content", action: "Combine both summaries", result: "Outline: introduce the reading room, compare the examples, and close with questions for future research." }],
    ],
  },
  {
    id: "game", title: "Game development planning", project: "Puddle Post · fictional courier game",
    goal: "Plan a small prototype for the fictional game Puddle Post.",
    stages: [
      [{ agent: "game", action: "Outline the game loop", result: "Prototype a loop in which players collect letters, cross puddles, and deliver them before sunset." }],
      [{ agent: "project", action: "Organize development milestones", result: "Sequence: movement and puddles, one short delivery route, then a small playtest." }],
    ],
  },
];

export function scenarioExecution(scenario: Scenario): ExecutionAdapter {
  const participants = ["ceo" as const, ...new Set(scenario.stages.flat().map(step => step.agent))];
  return {
    participants,
    async run(_prompt, _mode, _department, emit, signal) {
      const status = (department: DepartmentId, state: "working" | "completed" | "idle") =>
        emit({ type: "status", department, status: state });
      status("ceo", "working");
      emit({ type: "message", department: "ceo",
        text: `Simulation: I’ll coordinate “${scenario.title}” using fictional ${scenario.project.split(" · ")[0]} material.` });
      await pause(500, signal);
      for (const stage of scenario.stages) {
        for (const step of stage) {
          status(step.agent, "working");
          emit({ type: "activity", department: step.agent, text: step.action });
        }
        await pause(1250, signal);
        for (const step of stage) {
          emit({ type: "message", department: step.agent, text: `Synthetic result: ${step.result}` });
          emit({ type: "activity", department: step.agent, text: `Synthetic result ready · ${step.action}` });
          status(step.agent, "completed");
        }
      }
      emit({ type: "message", department: "ceo", text: `Simulated handoff complete. ${scenario.stages.flat().map(step =>
        `${departmentById[step.agent].name}: ${step.result}`).join(" ")}` });
      status("ceo", "completed");
      await pause(850, signal);
      for (const participant of participants) status(participant, "idle");
    },
  };
}
