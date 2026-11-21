import { useState } from "react";
import { departmentById } from "../../departments/config";
import { scenarios } from "../../data/scenarios";
import { useOfficeStore } from "../../store/useOfficeStore";
import { useReviewStore } from "../../store/useReviewStore";
import type { DepartmentId, Task } from "../../types";
import { Icon, PageHeader, Portrait, Status } from "../workspace/ui";
import { ReviewCenter } from "../reviews/ReviewCenter";
import { deliverables, scenarioDeliverable } from "./deliverables";
import "./showcase.css";

export function WorkflowResults({ task }: { task: Task }) {
  const messages = useOfficeStore(s => s.messages);
  const scenario = scenarios.find(item => item.goal === task.prompt);
  const ids = scenario
    ? [...new Set(messages.filter(m => m.taskId === task.id && (m.text.startsWith("Synthetic result:") || m.text.startsWith("Simulated handoff complete."))).map(m => m.department))]
    : task.status === "completed" && deliverables[task.department].request === task.prompt ? [task.department] : [];
  return <>{ids.map(id => <Result key={id} id={id} output={scenario ? scenarioDeliverable(scenario.id, id) : deliverables[id]}/>)}</>;
}

function Result({ id, output }: { id: DepartmentId; output: (typeof deliverables)[DepartmentId] }) {
  const [feedback, setFeedback] = useState("");
  const markdown = `# ${output.title}\n\n> Simulated deliverable · fictional demo data · ${departmentById[id].name}\n\n` +
    output.sections.map(([heading, body]) => `## ${heading}\n\n${body}\n`).join("\n");
  function download() {
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = output.title.toLowerCase().replaceAll(" ", "-") + ".md";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <details className="showcase-result">
    <summary>{output.title} <small>Simulated</small></summary>
    {output.sections.map(([heading, body]) => <section key={heading}><h4>{heading}</h4><p>{body}</p></section>)}
    <div className="showcase-actions">
      <button className="ws-button" onClick={async () => {
        try { await navigator.clipboard.writeText(markdown); setFeedback("Copied Markdown."); }
        catch { setFeedback("Clipboard unavailable. Use Download Markdown."); }
      }}>Copy Markdown</button>
      <button className="ws-button" onClick={download}>Download Markdown</button>
    </div>
    <small role="status">{feedback}</small>
  </details>;
}

export function ExecutionGraph({ scenario, task }: { scenario: (typeof scenarios)[number]; task?: Task }) {
  const [selected, select] = useState<DepartmentId>("ceo");
  const messages = useOfficeStore(s => s.messages);
  const statuses = useOfficeStore(s => s.statuses);
  const activities = useOfficeStore(s => s.activities);
  const reviews = useReviewStore(s => s.requests);
  const stages = [[{ agent: "ceo" as const, action: "Review the plan and consolidate results" }], ...scenario.stages];
  const review = task && reviews.find(item => item.taskId === task.id);
  const waiting = review?.status === "pending";
  const events = task ? activities.filter(event => event.taskId === task.id).reverse() : [];
  const ready = new Set(messages.filter(m => m.taskId === task?.id && task && (m.text.startsWith("Synthetic result:") || m.text.startsWith("Simulated handoff complete."))).map(m => m.department));
  const nodeStatus = (id: DepartmentId) => ready.has(id) ? "completed"
    : id === "ceo" && waiting ? "waiting_approval"
    : task?.status === "running" && statuses[id] === "working" ? "working"
    : task?.status === "cancelled" ? "cancelled" : task?.status === "error" ? "error" : "queued";
  return <>
    <ol className="demo-flow showcase-graph" aria-label="Execution stages">
      {stages.map((stage, i) => <li key={i} data-handoff={i > 0 && stage.some(node => nodeStatus(node.agent) === "working")}>
        <small>{i === 0 ? "CEO coordination" : stage.length > 1 ? "Parallel stage" : `Stage ${i}`}</small>
        {stage.map(node => <button className="showcase-node" key={node.agent} aria-pressed={selected === node.agent} onClick={() => select(node.agent)}>
          <Portrait id={node.agent} size="tiny"/><span>{departmentById[node.agent].name}</span><Status value={nodeStatus(node.agent)}/>
        </button>)}
      </li>)}
    </ol>
    <div className="showcase-inspection"><strong>{departmentById[selected].name}</strong><p>{stages.flat().find(node => node.agent === selected)?.action}</p></div>
    {review && <p role="status">Plan review · {review.status}{review.status === "rejected" ? " · Execution stopped before delegation." : ""}</p>}
    {events.length > 0 && <details className="showcase-result"><summary>Execution timeline</summary><ol className="showcase-timeline">{events.map(event => <li key={event.id}><time>{event.time}</time> {departmentById[event.department].name} · {event.text}</li>)}</ol></details>}
    {task && <WorkflowResults task={task}/>}
  </>;
}

export function WorkflowReviews() {
  const runningTask = useOfficeStore(s => s.tasks.find(task => task.status === "running"));
  const waiting = useReviewStore(s => s.requests.some(review => review.status === "pending" && runningTask && review.taskId === runningTask.id));
  return waiting ? <div className="showcase-review"><ReviewCenter/></div> : null;
}

const architecture = [
  ["CEO orchestration", "Routes a goal to specialist roles and coordinates the plan. The public demo runs predefined scenarios."],
  ["Specialized agents", "Seven specialist roles focus on a discipline. The public team uses fictional briefs and outputs."],
  ["Sequential and parallel collaboration", "Dependent stages run in order. Independent specialists share a stage, as in the research and knowledge example."],
  ["Structured result handoffs", "The private platform passes bounded structured results between stages. The demo visualizes handoffs with prepared sample deliverables."],
  ["Task runtime", "The private platform tracks local execution and cancellation. Public runs use an in-browser simulation with session-only state."],
  ["Tool gateway", "The private platform routes supported tools through a controlled gateway. Public agents never execute tools."],
  ["Permission-based execution", "The private platform enforces agent and workspace permissions independently. The demo has no workspace or tool access."],
  ["Human-in-the-loop approvals", "Public approvals gate simulated delegation. Private reviews govern scoped access. Live AI integration remains planned and disabled."],
];

export function ArchitectureShowcase({ back }: { back: () => void }) {
  return <><PageHeader title="How AgentHQ works" subtitle="The architecture behind the miniature office." action={<button className="ws-button" onClick={back}>Guided scenarios</button>}/>
    <div className="showcase-architecture">{architecture.map(([title, description], i) =>
      <section className="ws-panel" key={title}><Icon name={["home", "spark", "branch", "arrow", "activity", "code", "lock", "shield"][i]}/><h2>{title}</h2><p>{description}</p></section>
    )}</div></>;
}
