import type { AgentTab } from "../components/OfficeSidebar";
import { AgentsPage } from "../features/workspace/AgentsPage";
import { TasksPage } from "../features/workspace/TasksPage";
import { ActivityPage } from "../features/workspace/ActivityPage";
import { SettingsPage } from "../features/workspace/SettingsPage";
import { ProjectsPage } from "../features/workspace/ProjectsPage";
import { ArchitectureShowcase, ExecutionGraph, WorkflowReviews } from "../features/showcase/Showcase";
import { scenarios } from "../data/scenarios";

import { PageHeader, Status } from "../features/workspace/ui";
import { useOfficeStore } from "../store/useOfficeStore";
import type { DepartmentId } from "../types";

export type DemoView = "Architecture" | "Scenarios" | "Agents" | "Tasks" | "Projects" | "Activity" | "Settings";
type Scenario = (typeof scenarios)[number];

export function DemoPages({ view, visit, runScenario, navigate, restartTour, labels, shadows, setLabels, setShadows, stay, setStay }: {
  navigate: (view: DemoView) => void;
  view: DemoView; visit: (id: DepartmentId, tab?: AgentTab) => void; runScenario: (scenario: Scenario) => void; restartTour: () => void;
  stay: boolean; setStay: (value: boolean) => void;
  labels: boolean; shadows: boolean; setLabels: (value: boolean) => void; setShadows: (value: boolean) => void;
}) {
  const { running, tasks, cancel } = useOfficeStore();

  if (view !== "Scenarios") return <main className="workspace-page" aria-label={view + " page"} key={view}>
    {view === "Architecture" && <ArchitectureShowcase back={() => navigate("Scenarios")}/>}
    {view === "Projects" && <ProjectsPage visit={visit}/>}
    {view === "Agents" && <AgentsPage visit={visit}/>}
    {view === "Tasks" && <TasksPage/>}
    {view === "Activity" && <ActivityPage/>}
    {view === "Settings" && <SettingsPage {...{labels, shadows, setLabels, setShadows, stay, setStay, restartTour}}/>}
  </main>;

  return <main className="workspace-page demo-page" aria-label={`${view} page`}>
    {view === "Scenarios" && <>
      <PageHeader title="Guided scenarios" subtitle="Three fictional projects. Follow the team from brief to handoff."
        action={<div className="showcase-actions"><button className="ws-button" onClick={() => navigate("Architecture")}>How AgentHQ works</button>{running && <button className="ws-button" onClick={cancel}>Stop simulation</button>}</div>}/>
      <WorkflowReviews/>
      <div className="demo-scenario-grid">{scenarios.map(scenario => {
        const active = tasks.find(task => task.prompt === scenario.goal);
        return <article key={scenario.id} className="ws-panel demo-scenario">
          <p className="ws-context-label">{scenario.project}</p><h2>{scenario.title}</h2><p>{scenario.goal}</p>
          {active && <Status value={active.status}/>}
          <ExecutionGraph scenario={scenario} task={active}/>
          <button className="ws-button primary" disabled={running} onClick={() => runScenario(scenario)}>Run {scenario.title.toLowerCase()}</button>
        </article>;
      })}</div>
    </>}
  </main>;
}
