import type { DepartmentId } from "../../types";

type Deliverable = { title: string; request: string; sections: [string, string][] };
export const deliverables: Record<DepartmentId, Deliverable> = {
  engineering: { title: "Architecture review", request: "Review the fictional Fernboard architecture", sections: [
    ["Finding", "Fernboard’s issue form and issue service apply different title rules. A whitespace-only title can pass the form and fail later, leaving the editor without field-level feedback."],
    ["Recommendation", "Define trimming and validation in the issue service, then surface its structured error beside the title field. Keep the draft intact when validation fails."],
    ["Acceptance criteria", "A whitespace-only title is rejected, a valid title is trimmed exactly once, and keyboard focus returns to the invalid field. Cover all three cases before rollout."],
  ]},
  research: { title: "Research report", request: "Compare fictional Lantern Library source cards", sections: [
    ["Question", "How might shared reading sessions coexist with quiet study in Lantern Library?"],
    ["Evidence", "One fictional source card describes predictable quiet hours. A second highlights the social value of facilitated reading groups. The sample provides neither attendance counts nor a comparison group."],
    ["Next step", "Pilot a fixed group session and a separate quiet period. Record participation and disruptions; collect brief feedback before changing the schedule permanently."],
  ]},
  content: { title: "Technical article brief", request: "Draft a technical article about choosing useful pilot metrics", sections: [
    ["Opening", "A pilot should answer a concrete question. In Lantern Library, the question is whether a reading group can run without disrupting quiet study."],
    ["Structure", "Explain the two fictional source cards, define the pilot schedule, then show how attendance and interruption logs answer different questions."],
    ["Editorial checks", "Label examples fictional. Present observations alongside their limits and end with criteria for deciding whether to repeat the pilot."],
  ]},
  project: { title: "Project roadmap", request: "Plan milestones for the fictional Fernboard validation work", sections: [
    ["Milestone 1 · Define", "Agree on the title rule, error copy, and edge cases. Deliver a reviewable acceptance checklist."],
    ["Milestone 2 · Build", "Implement validation at the service boundary and connect field-level errors. Add tests once the rule is stable."],
    ["Milestone 3 · Verify", "Run a keyboard-only walkthrough and confirm that failed submission preserves the draft. Release after the review checklist passes."],
  ]},
  career: { title: "Career analysis", request: "Analyze the fictional candidate Mina’s backend interview preparation", sections: [
    ["Evidence", "Mina’s fictional portfolio describes a small service and automated tests. It gives no example of incident ownership or production scaling."],
    ["Preparation priority", "Prepare one concise story about a validation bug and the test that prevented recurrence. Label scale and reliability discussions as design exercises."],
    ["Practice", "Rehearse a five-minute walkthrough covering constraints, alternatives, the chosen trade-off, and the result. Ask a partner for feedback on specificity."],
  ]},
  knowledge: { title: "Knowledge summary", request: "Summarize the fictional Lantern Library notes", sections: [
    ["Sources", "Quiet Hours (sample note 01) describes an uninterrupted afternoon block. Shared Reading (sample note 02) proposes a facilitated group with a fixed end time."],
    ["Synthesis", "The notes describe complementary scheduling options. They offer no measured result about satisfaction or repeat participation."],
    ["Open question", "Would reserving a separate room preserve quiet hours? Verify the room schedule before publishing a pilot plan."],
  ]},
  game: { title: "Game design document", request: "Design a playable prototype for the fictional game Puddle Post", sections: [
    ["Player promise", "Deliver letters across a rain-soaked village before sunset. Each route trades speed against the risk of soaking a letter."],
    ["Core loop", "Pick up three letters, read the route markers, cross puddles using dry stepping stones, and choose which mailbox to visit first."],
    ["Prototype and playtest", "Build one route with two crossings and one optional shortcut. Observe whether players understand the water penalty before their first missed delivery."],
  ]},
  ceo: { title: "Executive summary", request: "Recommend a first pilot for the fictional team", sections: [
    ["Decision", "Start with a single measurable pilot and a review checkpoint before expanding the scope."],
    ["Ownership", "Assign one specialist to establish evidence, one to organize the work, and one to prepare the handoff. Keep each output tied to an explicit decision."],
    ["Review", "Ask whether the evidence supports the next step. Record open risks and the next owner before approving additional work."],
  ]},
};

export function scenarioDeliverable(scenario: string, agent: DepartmentId): Deliverable {
  const base = deliverables[agent];
  const context = {
    software: ["Fernboard", "Agree the title rule, implement inline validation, and test the keyboard flow before release."],
    research: ["Lantern Library", "Compare the fictional evidence, propose a reading-group pilot, and disclose the lack of measured outcomes."],
    game: ["Puddle Post", "Prototype one delivery route, test whether the puddle penalty is discoverable, and refine route markers before adding levels."],
  }[scenario];
  if (!context) return base;
  const [project, decision] = context;
  if (agent === "ceo") return { ...base, sections: [["Decision", decision], ["Ownership", "The specialist sequence in the run records the handoff. The CEO consolidates its findings for human review."], ["Release condition", "Review the sample outputs and decide whether to revise the plan before moving beyond the prototype."]] };
  if ((agent === "project" && scenario === "game") || (agent === "content" && scenario === "software")) {
    return { ...base, sections: [[project, decision], ["Review checkpoint", scenario === "game" ? "Test one short route with two crossings and observe where players hesitate. Defer extra levels until feedback is reviewed." : "Structure the article around the boundary bug, how field errors reach the editor, and what the acceptance tests prove. Keep implementation proposals distinct from findings."]] };
  }
  return base;
}
