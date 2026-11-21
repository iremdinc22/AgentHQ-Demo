export type DepartmentId =
  | "ceo"
  | "engineering"
  | "research"
  | "content"
  | "career"
  | "project"
  | "knowledge"
  | "game";
export type AgentStatus =
  "idle" | "working" | "waiting_approval" | "completed" | "error";
export type Mode = "ceo" | "direct";
export interface Department {
  id: DepartmentId;
  name: string;
  animal: string;
  emoji: string;
  color: string;
  position: [number, number, number];
  description: string;
  specialty: string;
}
export interface Message {
  taskId?: string;
  id: string;
  role: "user" | "assistant";
  text: string;
  department: DepartmentId;
  simulated: true;
}
export interface Task {
  participants?: readonly DepartmentId[];
  mode: Mode;
  createdAt: number;
  priority: "normal";
  id: string;
  prompt: string;
  department: DepartmentId;
  status: "running" | "completed" | "cancelled" | "error";
  simulated: true;
}
export interface Activity {
  taskId?: string;
  timestamp?: number;
  category?: "task" | "agent" | "approval" | "error";
  id: string;
  department: DepartmentId;
  text: string;
  time: string;
  simulated: true;
}
export type ExecutionEvent =
  | { type: "status"; department: DepartmentId; status: AgentStatus }
  | { type: "message"; department: DepartmentId; text: string }
  | { type: "activity"; department: DepartmentId; text: string };
export interface ExecutionAdapter {
  participants?: readonly DepartmentId[];
  run(
    prompt: string,
    mode: Mode,
    department: DepartmentId,
    emit: (event: ExecutionEvent) => void,
    signal: AbortSignal,
  ): Promise<void>;
}
