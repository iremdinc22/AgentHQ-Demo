import { deliverables } from "../showcase/deliverables";
import type { AgentTab } from "../../components/OfficeSidebar";
import { departments, departmentById } from "../../departments/config";
import { tasksForAgent } from "../../scene/agentVisuals";
import { useState, type CSSProperties } from "react";
import { useOfficeStore } from "../../store/useOfficeStore";
import type { DepartmentId } from "../../types";
import { Dialog, Icon, PageHeader, Portrait, Status, formatTime } from "./ui";
import { TaskComposer } from "./TaskComposer";
const roles: Record<DepartmentId, string> = {
 ceo: "Chief Orchestrator", engineering: "Software Engineering Agent",
 research: "Technology Research Agent", content: "Technical Content Agent",
 career: "Career Intelligence Agent", project: "Project Management Agent",
 knowledge: "Learning & Knowledge Agent", game: "Game Development Agent",
};
export function AgentsPage({visit}:{visit:(id:DepartmentId, tab?:AgentTab)=>void}) {
 const entries=departments,byId=departmentById,statuses=useOfficeStore(s=>s.statuses);
 const demo=useOfficeStore(s=>s.tasks);
 const [selected,setSelected]=useState<DepartmentId|null>(null),[creating,setCreating]=useState<DepartmentId|null>(null);
 const [example,setExample]=useState("");
 const assignment=(id:DepartmentId)=>tasksForAgent(demo,id).find(t=>t.status==="running"&&(t.department===id||statuses[id]==="working"||statuses[id]==="waiting_approval"))?.prompt;
 const agent=selected?byId[selected]:null;
 return <><PageHeader title="Your agents" subtitle="Your team for research, development, content, learning and more." action={<span className="ws-team-count"><Icon name="spark"/>8 companions</span>}/>
 <div className="ws-roster reference-roster">{entries.map(d=><article className="ws-agent-card" key={d.id} style={{"--agent-color":d.color} as CSSProperties}><div className="ws-agent-top"><span className="ws-agent-specialty">{roles[d.id]}</span><Status value={statuses[d.id]}/></div><button className="ws-agent-portrait-button" aria-label={`Meet ${d.animal}`} onClick={()=>setSelected(d.id)}><Portrait id={d.id} size="hero"/></button><h2>{d.animal}</h2><p className="ws-agent-department">{d.name}</p><div className="ws-agent-assignment"><span className="ws-assignment-dot"/>{assignment(d.id)||"A quiet moment between ideas"}</div><button className="ws-agent-open" onClick={()=>setSelected(d.id)} aria-label={`View ${d.name} details`}>Meet your {d.id==="ceo"?"coordinator":"specialist"}<Icon name="arrow" size={16}/></button></article>)}</div>
 <p className="ws-page-footnote">Local identities <span>·</span> Demo simulation only</p>
 {agent&&selected&&<Dialog title={agent.animal} drawer close={()=>setSelected(null)} eyebrow={agent.name}><div className="ws-agent-detail-hero" style={{"--agent-color":agent.color} as CSSProperties}><Portrait id={selected} size="large"/><div><Status value={statuses[selected]}/><h3>{roles[selected]}</h3><p>{agent.description}</p></div></div><div className="ws-detail-actions"><button className="ws-button primary" onClick={()=>{setSelected(null);visit(selected);}}>Visit Office <Icon name="arrow" size={16}/></button><button className="ws-button" onClick={()=>{setExample("");setCreating(selected);setSelected(null);}}><Icon name="plus" size={16}/>New task</button></div><section className="ws-detail-section"><h3>Office panel</h3><div className="ws-detail-actions">
 {(["Overview","Chat","Tasks","Activity"] as const).map(tab=><button className="ws-button" key={tab} onClick={()=>{setSelected(null);visit(selected,tab);}}>{tab}</button>)}
 </div></section><section className="ws-detail-section"><h3>On their desk</h3><p>{assignment(selected)||"No active assignment."}</p>{assignment(selected)&&<small>Demo simulation</small>}</section><section className="ws-detail-section"><h3>Professional profile</h3><p>{agent.specialty} · Demo simulation</p></section><section className="ws-detail-section"><h3>Workflow previews</h3><ul className="ws-capabilities"><li><Icon name="check" size={15}/>Sample deliverable · {deliverables[selected].title}</li><li><Icon name="check" size={15}/>{selected==="ceo"?"Demo Research → Content handoff":"Direct-mode task simulation"}</li></ul><p className="ws-hint">Models and execution tools are not connected.</p></section><section className="ws-detail-section"><h3>Example request</h3><p>{deliverables[selected].request}</p><button className="ws-button" onClick={()=>{setExample(deliverables[selected].request);setCreating(selected);setSelected(null);}}>Try this request</button></section><section className="ws-detail-section"><h3>Available task history</h3>{tasksForAgent(demo,selected).slice(0,5).map(t=><div className="ws-mini-task" key={t.id}><span>{t.prompt}<small>Demo · {formatTime(t.createdAt)}</small></span><Status value={t.status}/></div>)}{!tasksForAgent(demo,selected).length&&<p className="ws-hint">No tasks in the loaded history.</p>}</section></Dialog>}
 {creating&&<TaskComposer agent={creating} initialPrompt={example} close={()=>setCreating(null)}/>}
 </>;
}