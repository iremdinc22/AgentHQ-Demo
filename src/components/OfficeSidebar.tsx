import { useEffect } from "react";
import { departmentById } from "../departments/config";
import { specializationIcon } from "../departments/presentation";
import { ActivityFeed } from "../features/activity/ActivityFeed";
import { ChatPanel } from "../features/chat/ChatPanel";
import { ReviewCenter } from "../features/reviews/ReviewCenter";
import { EmptyState, Icon, Portrait, Status, formatTime } from "../features/workspace/ui";
import { tasksForAgent } from "../scene/agentVisuals";
import { useOfficeStore } from "../store/useOfficeStore";
import "./agent-panel.css";
import "./reference-workspace.css";

const tabs = ["Overview", "Chat", "Tasks", "Activity"] as const;
export type AgentTab = typeof tabs[number];
const icons = { Overview: "home", Chat: "chat", Tasks: "tasks", Activity: "activity" };

export function OfficeSidebar({ tab, setTab, close, draft, setDraft }: {
  tab: AgentTab;
  setTab: (tab: AgentTab) => void;
  close: () => void;
  draft: string;
  setDraft: (value: string) => void;
}) {
  const selected = useOfficeStore(s => s.selected);
  const focused = useOfficeStore(s => s.focusVersion > 0);
  const status = useOfficeStore(s => s.statuses[selected]);
  const tasks = useOfficeStore(s => s.tasks);
  const events = useOfficeStore(s => s.activities);
  const setMode = useOfficeStore(s => s.setMode);
  const agent = departmentById[selected];
  const assignments = tasksForAgent(tasks, selected);
  const activity = events.filter(event => event.department === selected);
  const active = assignments.find(task => task.status === "running" && status === "working");

  useEffect(() => {
    if (focused && tab === "Chat") setMode(selected === "ceo" ? "ceo" : "direct");
  }, [focused, tab, selected, setMode]);

  if (!focused) return <aside className="office-sidebar default-panel" aria-label="Office review and activity">
    <div className="operations-sidebar"><ReviewCenter office /><ActivityFeed /></div>
  </aside>;

  return <aside className="office-sidebar contextual-panel" aria-label={`${agent.name} agent panel`}>
    <header className="agent-context-header">
      <div className="agent-context-identity">
        <Portrait id={selected} size="large" />
        <div><h2>{agent.name}</h2><p>{agent.specialty}</p>
          <div className="context-status"><Status value={status === "idle" ? "available" : status} /><small>Office simulation</small></div>
        </div>
        <button onClick={close} aria-label="Close agent panel and return to overview"><Icon name="close" /></button>
      </div>
    </header>
    <div className="office-sidebar-tabs" role="tablist" aria-label="Agent panel sections">
      {tabs.map((item, index) => <button key={item} id={`agent-tab-${item}`} role="tab" aria-selected={tab === item}
        aria-controls={`agent-panel-${item}`} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)}
        onKeyDown={event => {
          const next = event.key === "ArrowRight" ? tabs[(index + 1) % 4] : event.key === "ArrowLeft" ? tabs[(index + 3) % 4]
            : event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[3] : null;
          if (next) { event.preventDefault(); setTab(next); document.getElementById(`agent-tab-${next}`)?.focus(); }
        }}><Icon name={icons[item]} size={15}/>{item}</button>)}
    </div>
    <div className="agent-context-body reference-overview" role="tabpanel" id="agent-panel-Overview" aria-labelledby="agent-tab-Overview" hidden={tab !== "Overview"}>
      <div className="reference-metrics">
        <div><Icon name="tasks" /><strong>{active ? 1 : 0}</strong><small>Active</small></div>
        <div><Icon name="check" /><strong>{assignments.filter(task => task.status === "completed").length}</strong><small>Completed demos</small></div>
        <div><Icon name="clock" /><strong className="metric-time">{activity[0]?.time ?? "—"}</strong><small>Last activity</small></div>
      </div>
      {active && <section><h3>Current simulation</h3><p>{active.prompt}</p></section>}
      <section><h3>About</h3><p>{agent.description}</p></section>
      <section><h3>Specialization</h3><ul className="reference-chips">
        <li><Icon name={specializationIcon(agent.specialty)} size={15}/>{agent.specialty}</li>
      </ul></section>
      <button className="ws-button primary" onClick={() => setTab("Chat")}><Icon name="chat" />Start a conversation</button>
    </div>
    <div className="side-chat-slot" role="tabpanel" id="agent-panel-Chat" aria-labelledby="agent-tab-Chat" hidden={tab !== "Chat"}>
      <ChatPanel draft={draft} setDraft={setDraft} />
    </div>
    <div className="agent-context-body reference-task-list" role="tabpanel" id="agent-panel-Tasks" aria-labelledby="agent-tab-Tasks" hidden={tab !== "Tasks"}>
      {assignments.length ? assignments.map(task => <article className="agent-record" key={task.id}>
        <Icon name="tasks" /><div><strong>{task.prompt}</strong><small>Simulated · {formatTime(task.createdAt)}</small></div><Status value={task.status}/>
      </article>) : <EmptyState icon="tasks" title="No assignments yet">Run a guided scenario or start a conversation.</EmptyState>}
    </div>
    <div className="agent-context-body" role="tabpanel" id="agent-panel-Activity" aria-labelledby="agent-tab-Activity" hidden={tab !== "Activity"}>
      {activity.length ? <ol className="agent-timeline">{activity.map(event => <li key={event.id}>
        <Icon name="activity" /><div><p>{event.text}</p><small>{event.time} · Simulated</small></div>
      </li>)}</ol> : <EmptyState icon="activity" title="All quiet for now">Simulated updates will appear here.</EmptyState>}
    </div>
  </aside>;
}
