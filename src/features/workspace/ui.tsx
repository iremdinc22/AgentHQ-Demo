import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { agentPresentation } from "../../departments/presentation";
import { departmentById } from "../../departments/config";
import type { DepartmentId } from "../../types";
export function Icon({name,size=18}:{name:string;size?:number}) {
 const paths:Record<string,ReactNode>={
 shield:<path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10Zm-3-11 2 2 4-4"/>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></>,
 info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
 send:<path d="m21 3-7 18-3.8-7.2L3 10l18-7ZM10.2 13.8 21 3"/>,
 stop:<rect x="6" y="6" width="12" height="12" rx="2"/>,
 code:<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>,
 branch:<path d="M6 5v14m0-4c8 0 12-4 12-10M4 5h4m-4 14h4m8-14h4"/>,
 flask:<path d="M9 3h6m-5 0v7L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3M7 15h10"/>,
 edit:<path d="m3 21 4.5-1 13-13-3.5-3.5-13 13L3 21Zm12-15 3.5 3.5"/>,
 briefcase:<><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 13h18m-11-1v3h4v-3"/></>,
 gamepad:<path d="M7 8h10c3 0 4 4 4 7 0 3-2 4-4 2l-2-2H9l-2 2c-2 2-4 1-4-2 0-3 1-7 4-7Zm0 2v4m-2-2h4m7 0h.01m3 1h.01"/>,
 flag:<path d="M5 21V4h13l-3 4 3 4H5"/>,
 target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></>,
home:<path d="m3 11 9-7 9 7v9h-6v-6H9v6H3Z"/>,chat:<path d="M5 16 3 21l6-2h7a5 5 0 0 0 5-5v-3a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v1a5 5 0 0 0 2 4Z"/>,plus:<path d="M12 5v14M5 12h14"/>,search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,arrow:<path d="M5 12h14m-6-6 6 6-6 6"/>,close:<path d="m6 6 12 12M18 6 6 18"/>,folder:<path d="M3 7V5h7l2 3h9v12H3V7Z"/>,tasks:<><rect x="5" y="4" width="15" height="17" rx="2"/><path d="m2 8 2 2 3-4M10 9h6M9 14h7M9 17h5"/></>,spark:<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,refresh:<><path d="M20 10a8 8 0 1 0-1 7M20 4v6h-6"/></>,book:<><path d="M12 6C9 3 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/></>,settings:<><path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/></>,check:<path d="m5 12 4 4L19 6"/>,chevron:<path d="m9 5 7 7-7 7"/>,activity:<path d="M3 12h4l3-7 4 14 3-7h4"/>,lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]??paths.spark}</svg>;
}
export function Portrait({id,size="small"}:{id:string|null;size?:"tiny"|"small"|"large"|"hero"}) {
 const d=id && Object.hasOwn(departmentById,id)?departmentById[id as DepartmentId]:null;
 return <span className={`ws-portrait ${size}`} style={{"--agent-color":d ? agentPresentation[d.id].accent : "#e8eddf"} as CSSProperties}>{d?<img src={`/portraits/${d.id}.jpg`} alt={d.animal} width="320" height="320" loading="lazy"/>:<Icon name="tasks"/>}</span>;
}
export function Status({value}:{value:string}) {const text=value==="error"?"Failed":value.replaceAll("_"," ");return <span className={`ws-status ${value}`}><i/>{text}</span>}
export function PageHeader({title,subtitle,action}:{title:string;subtitle:string;action?:ReactNode}) {return <header className="ws-page-header"><div><span className="ws-eyebrow">YOUR COMPANY / WORKSPACE</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</header>}
export function EmptyState({icon="spark",title,children,action}:{icon?:string;title:string;children?:ReactNode;action?:ReactNode}) {return <div className="ws-empty"><span className="ws-empty-icon"><Icon name={icon} size={25}/></span><h3>{title}</h3>{children&&<p>{children}</p>}{action}</div>}
export function Dialog({title,children,close,drawer=false,eyebrow}:{title:string;children:ReactNode;close:()=>void;drawer?:boolean;eyebrow?:string}) {
 const ref=useRef<HTMLDialogElement>(null),id=useId();
 useEffect(()=>{const node=ref.current;node?.showModal();node?.querySelector<HTMLElement>("input:not([type=hidden]),textarea")?.focus();return()=>node?.close();},[]);
 return <dialog ref={ref} className={`ws-dialog ${drawer?"ws-drawer":""}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}><div className="ws-dialog-inner"><header>{eyebrow&&<span className="ws-eyebrow">{eyebrow}</span>}<h2 id={id}>{title}</h2><button className="ws-icon-button" aria-label={`Close ${title}`} onClick={close}><Icon name="close"/></button></header><div className="ws-dialog-content">{children}</div></div></dialog>;
}
export function SearchField({value,onChange,placeholder="Search…",label="Search"}:{value:string;onChange:(v:string)=>void;placeholder?:string;label?:string}) {return <label className="ws-search"><Icon name="search"/><input aria-label={label} type="search" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/></label>}
export const formatDate=(value:string|number)=>new Date(value).toLocaleDateString(undefined,{month:"short",day:"numeric"});
export const formatTime=(value:string|number)=>new Date(value).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
