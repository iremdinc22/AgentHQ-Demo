import { useState } from "react";
import { useOfficeStore } from "../../store/useOfficeStore";
import { departmentById } from "../../departments/config";
import type { DepartmentId } from "../../types";
import { Dialog } from "./ui";
export function TaskComposer({agent,close,initialPrompt=""}:{agent?:DepartmentId;initialPrompt?:string;close:()=>void}) {
 const [prompt,setPrompt]=useState(initialPrompt);const running=useOfficeStore(s=>s.running),mode=useOfficeStore(s=>s.mode),selected=useOfficeStore(s=>s.selected),submit=useOfficeStore(s=>s.submit);
 return <Dialog title="New demo task" close={close} eyebrow="SESSION SIMULATION"><form className="ws-form" onSubmit={e=>{e.preventDefault();if(prompt.trim()&&!running){if(agent) useOfficeStore.getState().select(agent); void submit(prompt,undefined,agent ? (agent==="ceo"?"ceo":"direct") : undefined);close();}}}><p className="ws-hint">{(agent ? agent==="ceo" : mode==="ceo")?"CEO handoff · Research → Content":`Direct · ${departmentById[agent??selected].name}`}</p><label>Demo request<textarea autoFocus required rows={4} maxLength={2000} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="An idea for your little company…"/></label><div className="ws-form-footer"><button className="ws-button primary" disabled={running||!prompt.trim()}>Run simulation</button></div></form></Dialog>;
}