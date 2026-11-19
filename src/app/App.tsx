import { DemoPages, type DemoView } from "./DemoPages";
import "../features/workspace/workspace.css";
import "./demo.css";
import { useEffect, useState } from "react";
import { Office } from "../scene/Office";
import type { DepartmentId } from "../types";
import { departmentById } from "../departments/config";
import { useOfficeStore } from "../store/useOfficeStore";
import { ChatPanel } from "../features/chat/ChatPanel";
import { OfficeSidebar, type AgentTab } from "../components/OfficeSidebar";

export default function App() {
  const statuses = useOfficeStore(s => s.statuses);
  const visit = (id: DepartmentId, tab: AgentTab = "Overview") => { select(id); setAgentTab(tab); setMobilePane(tab === "Overview" ? "office" : "conversation"); setView("Office"); };
  const [view, setView] = useState<"Office" | DemoView>("Office");
  const [agentTab, setAgentTab] = useState<AgentTab>("Overview");
  const [chatDraft, setChatDraft] = useState("");
  const [mobilePane, setMobilePane] = useState<"office" | "conversation">("office");
  const [labels, setLabels] = useState(true);
  const [shadows, setShadows] = useState(true);
  const [stay, setStay] = useState(false);
  const overview = useOfficeStore((s) => s.overview);
  const select = useOfficeStore((s) => s.select);
  const selected = useOfficeStore((s) => s.selected);
  const focus = useOfficeStore((s) => s.focusVersion);
  const setMode = useOfficeStore((s) => s.setMode);
  const running = useOfficeStore((s) => s.running);
  const tasks = useOfficeStore((s) => s.tasks);
  useEffect(() => { if (focus === 0) setAgentTab("Overview"); }, [focus]);
  const active = Object.values(statuses).filter((s) => s === "working").length;
  return (
    <div className={`app-shell ${view !== "Office" ? "workspace-shell" : ""} ${labels ? "" : "quiet-labels"}`}>
      <header className="topbar">
        <a className="brand" href="/" aria-label="AgentHQ home">
          <span className="brand-icon">
            a<span>✳</span>
          </span>
          Agent<span>HQ</span>
          <small>THE AGENT OFFICE</small>
        </a>
        <nav aria-label="Main navigation">
          {(
            ["Office", "Tasks", "Agents", "Projects", "Activity", "Settings"] as const
          ).map((item) => (
            <button
              key={item}
              className={view === item ? "active" : ""}
              aria-current={view === item ? "page" : undefined}
              onClick={() => { setView(item); if (item === "Office") setMobilePane("office"); }}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <span className="active-count">
            <i className={active ? "working" : ""} />
            {active} active <span className="count-context">agents</span>
          </span>
          <span className="local-badge">{running ? "Simulation running" : "Portfolio demo"}</span>
          <button
            className="overview-button"
            onClick={() => {
              overview();
              setMobilePane("office");
              setView("Office");
            }}
          >
            ⌖ <span>Overview</span>
          </button>
        </div>
      </header>
      <main className="dashboard office-chat-layout" data-mobile-pane={mobilePane} hidden={view !== "Office"}>
        <div className="mobile-office-switch" role="group" aria-label="Office or conversation view">
          <button aria-pressed={mobilePane === "office"} onClick={() => setMobilePane("office")}>Office view</button>
          <button aria-pressed={mobilePane === "conversation"} onClick={() => setMobilePane("conversation")}>Agent view</button>
        </div>
        <section
          className="office-stage"
          aria-label="Interactive 3D animal office"
        >
          <div className="office-viewport">
          <div className="scene-wrap">
            <Office shadows={shadows} />
          </div>
          {focus > 0 ? (
            <section
              className="selected-peek card"
              aria-label="Selected department"
            >
              <div className="peek-heading">
                <span
                  className="avatar"
                  style={{ background: departmentById[selected].color }}
                >
                  {departmentById[selected].emoji}
                </span>
                <div>
                  <span className="eyebrow">YOUR SELECTED DEPARTMENT</span>
                  <h2>{departmentById[selected].name}</h2>
                </div>
                <button
                  onClick={overview}
                  aria-label="Close department details"
                >
                  ×
                </button>
              </div>
              <p>{departmentById[selected].description}</p>
              <div className="peek-bottom">
                <span className={`status ${statuses[selected]}`}>
                  ● {statuses[selected].replace("_", " ")}
                </span>
                <button onClick={() => { setMode("direct"); setAgentTab("Chat"); setMobilePane("conversation"); }}>
                  Talk directly ↗
                </button>
              </div>
            </section>
          ) : (
            <section className="welcome-card card">
              <span className="eyebrow">YOUR LITTLE AI COMPANY</span>
              <h1>
                Room for big ideas<span>.</span>
              </h1>
              <p>
                Eight curious minds, one shared space.
                <br />A fictional team. A fully interactive simulation.
              </p>
              <div className="welcome-stats">
                <span>
                  <b>{tasks.filter((t) => t.status === "completed").length}</b>{" "}
                  simulated tasks
                </span>
                <span>
                  <b>{active}</b> working
                </span>
                <span>
                  <b>0</b> model calls
                </span>
              </div>
              <button className="ws-button primary demo-quickstart" onClick={() => setView("Scenarios")}>Explore guided scenarios</button>
            </section>
          )}
          <div className="scene-top-note">
            <span>✧</span> A small office with a world of possibilities
          </div>
          <div className="scene-tools">
            <span>
              DRAG TO ORBIT <i /> SCROLL TO ZOOM
            </span>
            <button onClick={overview} aria-label="Reset office camera">
              ⌖
            </button>
          </div>
          <div className="office-legend">
            <span className="live-dot" />{" "}
            {running ? "SIMULATION IN PROGRESS" : "PORTFOLIO SIMULATION"} <b>·</b> ORIGINAL PROCEDURAL WORLD
          </div>
          </div>
          <div className="office-compact-composer" hidden={focus > 0 && agentTab === "Chat"}><ChatPanel compact draft={chatDraft} setDraft={setChatDraft} /></div>
        </section>
        <OfficeSidebar tab={agentTab} setTab={setAgentTab} draft={chatDraft} setDraft={setChatDraft} close={() => { overview(); setAgentTab("Overview"); setMobilePane("office"); }} />
      </main>
      {view !== "Office" && <DemoPages view={view} visit={visit} office={() => setView("Office")}
        stay={stay} setStay={setStay} labels={labels} shadows={shadows} setLabels={setLabels} setShadows={setShadows} />}
    </div>
  );
}
