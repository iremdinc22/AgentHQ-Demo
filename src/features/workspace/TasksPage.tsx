import { WorkflowResults } from "../showcase/Showcase";
import { useState } from "react";
import { useOfficeStore } from "../../store/useOfficeStore";
import { useReviewStore } from "../../store/useReviewStore";
import { departmentById, departments } from "../../departments/config";
import { ReviewCenter } from "../reviews/ReviewCenter";
import { TaskComposer } from "./TaskComposer";
import { Dialog, EmptyState, Icon, PageHeader, Portrait, SearchField, Status, formatTime } from "./ui";
import { demoRows, filterTasks, taskCounts } from "./data";
import type { DepartmentId } from "../../types";
export function TasksPage() {
 const demo=useOfficeStore(s=>s.tasks),messages=useOfficeStore(s=>s.messages),cancel=useOfficeStore(s=>s.cancel);
 const reviews=useReviewStore(s=>s.requests.filter(r=>r.status==="pending").length);
 const [source,setSource]=useState<"demo"|"reviews">("demo"),[query,setQuery]=useState(""),[status,setStatus]=useState("all"),[agent,setAgent]=useState("all");
 const [creating,setCreating]=useState(false),[detail,setDetail]=useState<string|null>(null);
 const rows=demoRows(demo),counts=taskCounts(rows),filtered=filterTasks(rows,query,status,agent);
 const open=(id:string)=>{setDetail(id);};
 const task=demo.find(t=>t.id===detail);
 const title=task?task.prompt:"Task details";
 return <><PageHeader title="Tasks" subtitle="A clear desk. A little momentum." action={<button className="ws-button primary" onClick={()=>setCreating(true)}><Icon name="plus"/>New task</button>}/>
 <div className="ws-tabs" role="group" aria-label="Task source"><button aria-pressed={source==="demo"} onClick={()=>{setSource("demo");setDetail(null);}}>Demo Tasks <span>{demo.length}</span></button><button aria-pressed={source==="reviews"} onClick={()=>{setSource("reviews");setDetail(null);}}>Review desk <span>{reviews}</span></button></div>
 {source==="reviews"?<div className="ws-review-workspace"><ReviewCenter/></div>:<>
 <div className="ws-summary" aria-label={`${source} task counts`}>{Object.entries(counts).map(([key,value])=><button key={key} onClick={()=>setStatus(status===key?"all":key)} aria-pressed={status===key}><span className={`ws-summary-dot ${key}`}/><span>{key==="unsuccessful"?"Unsuccessful":key}</span><strong>{value}</strong></button>)}</div>
 <div className="ws-list-heading"><span className="ws-context-label">DEMO · SESSION ONLY</span></div>
 <section className="ws-panel"><div className="ws-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search tasks…" label="Search tasks"/><select aria-label="Task status" value={status} onChange={e=>setStatus(e.target.value)}>{["all","pending","running","completed","unsuccessful","failed","cancelled"].map(s=><option key={s} value={s}>{s==="all"?"All statuses":s[0].toUpperCase()+s.slice(1)}</option>)}</select><select aria-label="Assigned agent filter" value={agent} onChange={e=>setAgent(e.target.value)}><option value="all">All agents</option><option value="unassigned">Unassigned</option>{departments.map(d=><option key={d.id} value={d.id}>{d.animal}</option>)}</select></div>
 <div className="ws-task-table" role="list" aria-label="Task list"><div className="ws-task-head" aria-hidden="true"><span>Task</span><span>Department</span><span>Status</span><span>Created</span><span>Actions</span></div>
 {filtered.map(row=><article className="ws-task-row" role="listitem" key={row.id}><div className="ws-task-title"><Portrait id={row.agent} size="tiny"/><button onClick={()=>open(row.id)}>{row.title}</button></div><span className="ws-task-department">{row.agent&&Object.hasOwn(departmentById,row.agent)?departmentById[row.agent as DepartmentId].name:"Unassigned"}</span><Status value={row.status}/><time dateTime={new Date(row.created).toISOString()}>{formatTime(row.created)}</time><div>{row.status==="running"?<button className="ws-button small" onClick={cancel}>Cancel simulation</button>:<button className="ws-text-button" onClick={()=>open(row.id)}>View <Icon name="chevron" size={14}/></button>}</div></article>)}
 {!filtered.length&&<EmptyState icon="tasks" title={rows.length?"Nothing matches just yet":"A fresh page for your next idea"}>{rows.length?"Try a different search or filter.":"Give one of your teammates a task to get started."}</EmptyState>}
 </div><footer className="ws-list-footer"><span>{filtered.length} of {rows.length} loaded {source==="demo"?"demo ":""}tasks</span></footer></section>
 </>}
 {creating&&<TaskComposer close={()=>setCreating(false)}/>}
 {detail&&source!=="reviews"&&<Dialog title={title} close={()=>setDetail(null)} drawer eyebrow="DEMO TASK · SIMULATED">{task&&"prompt" in task?<><Status value={task.status}/><dl className="ws-metadata"><dt>Agent</dt><dd>{departmentById[task.department].animal}</dd><dt>Created</dt><dd>{formatTime(task.createdAt)}</dd><dt>Priority</dt><dd>{task.priority}</dd></dl>{task.status==="running"&&<button className="ws-button" onClick={cancel}>Cancel simulation</button>}<section className="ws-result"><h3>Simulated output</h3><WorkflowResults task={task}/>{messages.filter(m=>m.taskId===task.id).map(m=><p key={m.id}>{m.text}</p>)}{!messages.some(m=>m.taskId===task.id)&&<p>No output yet.</p>}</section></>:<p>Task unavailable.</p>}</Dialog>}
 </>;
}