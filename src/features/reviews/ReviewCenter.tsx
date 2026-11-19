import { Portrait } from "../workspace/ui";
import { useEffect, useRef, useState } from "react";
import { departmentById } from "../../departments/config";
import { canDecide, decisionHistory, pendingReviews, useReviewStore, type Approval } from "../../store/useReviewStore";
import { useOfficeStore } from "../../store/useOfficeStore";
const date = (n: number) => new Date(n).toLocaleString();
export function ReviewCenter({office = false}: {office?: boolean}) {
  const requests = useReviewStore(s => s.requests);
  const [filter,setFilter] = useState<"all"|"approved"|"rejected">("all");
  const [dialog,setDialog] = useState<{id:string;reject:boolean}|null>(null);
  const pending = pendingReviews(requests);
  const history = decisionHistory(requests,filter);
  const open = (id:string,reject=false) => setDialog({id,reject});
  const selected = requests.find(r=>r.id===dialog?.id);
  return <>
    <section className={office ? "approvals card reference-inbox":"control-card"} aria-label="Pending approvals">
      <header className="section-heading">
        {office && <Portrait id="ceo" size="small" />}
        <div><h2>{office ? "CEO Review Desk" : "Pending approvals"} <span className="count">{pending.length}</span></h2>
        {office && <p>Review fictional work proposals.</p>}</div>
      </header>
      <div className={office ? "approval-list" : "review-grid"}>
        <h3 className="review-group-title">Workflow previews <span>{pending.length}</span></h3>
        <p className="section-note">Demo decisions apply only to this session.</p>
        {pending.map(r => <ReviewCard key={r.id} request={r} open={open} />)}
        {!pending.length && <p className="empty-state">No simulated requests awaiting approval.</p>}
      </div>
    </section>
    {!office && <section className="control-card decision-history" aria-label="Decision history"><div className="section-heading"><h2>Decision History</h2><span className="simulation-tag">SESSION ONLY</span></div><p>Decisions stay available while navigating this session. Reloading resets this demo.</p><label className="filter-label">Decision filter <select value={filter} onChange={e=>setFilter(e.target.value as typeof filter)}><option value="all">All</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label><div className="review-grid">{history.map(r=><ReviewCard key={r.id} request={r} open={open}/>)}</div>{!history.length && <p className="empty-state">No decisions in this filter yet.</p>}</section>}
    {selected && dialog && <ReviewDialog key={`${selected.id}-${dialog.reject}`} request={selected} rejection={dialog.reject} close={()=>setDialog(null)} reject={()=>open(selected.id,true)}/>}
  </>;
}
function ReviewCard({request:r,open}:{request:Approval;open:(id:string,reject?:boolean)=>void}) {
  const decide = useReviewStore(s=>s.decide);
  const d=departmentById[r.department];
  return <article className="approval-card"><div className="approval-meta"><Portrait id={r.department} size="tiny" /><span>{d.name}</span><span className={`review-status ${r.status}`}>{r.status}</span></div><h3>{r.title}</h3><p>{r.summary}</p>{r.createdAt && <small>Created {date(r.createdAt)}</small>}{r.decidedAt && <small>Decided {date(r.decidedAt)}</small>}{r.rejectionReason && <p className="rejection-reason">Reason: {r.rejectionReason}</p>}{r.taskId && <small>Related task: {r.taskId}</small>}<div className="approval-actions">{canDecide(r) && <><button className="review-approve" onClick={()=>decide(r.id,"approved")}>Approve</button><button className="review-reject" onClick={()=>open(r.id,true)}>Reject</button></>}<button onClick={()=>open(r.id)}>View Details</button></div></article>;
}
function ReviewDialog({request:r,rejection,close,reject}:{request:Approval;rejection:boolean;close:()=>void;reject:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  const [reason,setReason]=useState("");
  const decide=useReviewStore(s=>s.decide);
  const task=useOfficeStore(s=>s.tasks.find(t=>t.id===r.taskId));
  useEffect(()=>{const node=ref.current;node?.showModal();return()=>node?.close();},[]);
  const pending=canDecide(r);
  const decision=(status:"approved"|"rejected")=>{decide(r.id,status,reason);close();};
  return <dialog ref={ref} className="review-dialog card" aria-label={rejection ? "Confirm simulated rejection":"Review request details"} onCancel={close}><span className="eyebrow">SIMULATED REVIEW · {r.status}</span><h2>{rejection ? "Reject request?":r.title}</h2>{rejection && <h3>{r.title}</h3>}<dl className="metadata"><dt>Agent</dt><dd><Portrait id={r.department} size="tiny" /> {departmentById[r.department].name}</dd><dt>Status</dt><dd>{r.status}</dd>{r.createdAt && <><dt>Created</dt><dd>{date(r.createdAt)}</dd></>}{r.decidedAt && <><dt>Decision</dt><dd>{date(r.decidedAt)}</dd></>}{r.taskId && <><dt>Related task</dt><dd>{task?.prompt ?? r.taskId}</dd></>}</dl><p>{r.summary}</p>{!rejection && <><h3>Proposed preview</h3><p>{r.preview ?? "No proposed output is available."}</p></>}{r.rejectionReason && <p>Reason: {r.rejectionReason}</p>}{pending && rejection && <label className="rejection-input">Optional rejection reason<textarea autoFocus maxLength={1000} value={reason} onChange={e=>setReason(e.target.value)} rows={3}/></label>}<p className="section-note">This decision changes demo review state only. No agents, tools, files or model calls will execute.</p><div className="approval-actions">{pending && (rejection ? <button className="review-reject" onClick={()=>decision("rejected")}>Confirm rejection</button>:<><button autoFocus className="review-approve" onClick={()=>decision("approved")}>Approve</button><button className="review-reject" onClick={reject}>Reject</button></>)}<button onClick={close}>{pending ? rejection ? "Cancel":"Later":"Close"}</button></div></dialog>;
}
