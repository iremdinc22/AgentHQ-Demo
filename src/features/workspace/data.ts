import type { Task } from "../../types";
export interface TaskRow {id:string;title:string;agent:string|null;status:string;created:string|number}
export const demoRows=(tasks:Task[]):TaskRow[]=>tasks.map(t=>({id:t.id,title:t.prompt,agent:t.department,status:t.status==="error"?"failed":t.status,created:t.createdAt}));
export function filterTasks(rows:TaskRow[],query:string,status:string,agent:string){
 const q=query.trim().toLowerCase();
 return rows.filter(t=>{
  const matchesStatus=status==="all"||(status==="unsuccessful"?["failed","cancelled"].includes(t.status):t.status===status);
  const matchesAgent=agent==="all"||(agent==="unassigned"?t.agent===null:t.agent===agent);
  return (!q||t.title.toLowerCase().includes(q))&&matchesStatus&&matchesAgent;
 });
}
export function taskCounts(rows:TaskRow[]){return {pending:rows.filter(t=>t.status==="pending").length,running:rows.filter(t=>t.status==="running").length,completed:rows.filter(t=>t.status==="completed").length,unsuccessful:rows.filter(t=>["failed","cancelled"].includes(t.status)).length};}
