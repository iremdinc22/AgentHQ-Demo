import { create } from "zustand";
import { departments } from "../departments/config";
import { mockExecution } from "../data/mockExecution";
import type {
  Activity,
  AgentStatus,
  DepartmentId,
  Message,
  Mode,
  Task,
  ExecutionAdapter,
} from "../types";
const uid = () => crypto.randomUUID();
const initialStatuses = () =>
  Object.fromEntries(departments.map((d) => [d.id, "idle"])) as Record<
    DepartmentId,
    AgentStatus
  >;
let controller: AbortController | undefined;
interface OfficeStore {
  selected: DepartmentId;
  mode: Mode;
  statuses: Record<DepartmentId, AgentStatus>;
  messages: Message[];
  tasks: Task[];
  activities: Activity[];
  running: boolean;
  focusVersion: number;
  cameraResetVersion: number;
  select: (id: DepartmentId) => void;
  setMode: (mode: Mode) => void;
  overview: () => void;
  submit: (prompt: string, adapter?: ExecutionAdapter, modeOverride?: Mode) => Promise<void>;
  cancel: () => void;
  recordActivity: (department: DepartmentId, text: string, category?: Activity["category"]) => void;
}
export const useOfficeStore = create<OfficeStore>((set, get) => ({
  selected: "ceo",
  mode: "ceo",
  statuses: initialStatuses(),
  messages: [
    {
      id: "welcome",
      role: "assistant",
      department: "ceo",
      simulated: true,
      text: "Welcome to your little company. Share a big idea, and we’ll walk through a simulated handoff together.",
    },
  ],
  tasks: [],
  activities: [],
  running: false,
  focusVersion: 0,
  cameraResetVersion: 0,
  select: (selected) =>
    set((s) => ({ selected, focusVersion: s.focusVersion + 1 })),
  setMode: (mode) => set({ mode }),
  overview: () =>
    set((s) => ({
      focusVersion: 0,
      cameraResetVersion: s.cameraResetVersion + 1,
    })),
  recordActivity: (department, text, category = "agent") => set(s => ({
    activities: [{ id: uid(), department, text, category, timestamp: Date.now(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), simulated: true as const }, ...s.activities].slice(0, 100),
  })),
  cancel: () => {
    if (get().running) get().recordActivity(get().tasks.find(t => t.status === "running")?.department ?? get().selected, "Task cancelled", "task");
    controller?.abort();
    set((s) => ({
      running: false,
      statuses: initialStatuses(),
      tasks: s.tasks.map((t) =>
        t.status === "running" ? { ...t, status: "cancelled" } : t,
      ),
    }));
  },
  submit: async (raw, adapter = mockExecution, modeOverride) => {
    const prompt = raw.trim();
    if (!prompt || get().running) return;
    const { mode: currentMode, selected } = get();
    const mode = modeOverride ?? currentMode;
    const department = mode === "ceo" ? "ceo" : selected;
    const id = uid();
    const activeController = new AbortController();
    controller = activeController;
    set((s) => ({
      running: true,
      messages: [
        ...s.messages,
        { id: uid(), role: "user", text: prompt, department, simulated: true },
      ],
      tasks: [
        {
          id,
          mode,
          createdAt: Date.now(),
          priority: "normal" as const,
          participants: adapter.participants ?? (mode === "ceo" ? ["ceo", "research", "content"] : [department]),
          prompt,
          department,
          status: "running" as const,
          simulated: true as const,
        },
        ...s.tasks,
      ].slice(0, 30),
    }));
    get().recordActivity(department, `Task created: ${prompt}`, "task");
    try {
      await adapter.run(
        prompt,
        mode,
        department,
        (e) => {
          if (activeController.signal.aborted) return;
          if (e.type === "status") {
            get().recordActivity(e.department, `Agent status: ${e.status.replace("_", " ")}`, "agent");
            set((s) => ({
              statuses: { ...s.statuses, [e.department]: e.status },
            }));
          }
          if (e.type === "message")
            set((s) => ({
              messages: [
                ...s.messages,
                {
                  id: uid(),
                  role: "assistant",
                  text: e.text,
                  taskId: id,
                  department: e.department,
                  simulated: true,
                },
              ],
            }));
          if (e.type === "activity")
            set((s) => ({
              activities: [
                {
                  id: uid(),
                  timestamp: Date.now(),
                  category: "agent" as const,
                  taskId: id,
                  department: e.department,
                  text: e.text,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  simulated: true as const,
                },
                ...s.activities,
              ].slice(0, 100),
            }));
        },
        activeController.signal,
      );
      if (!activeController.signal.aborted) {
        get().recordActivity(department, "Task completed (simulation)", "task");
        set((s) => ({
          running: false,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: "completed" } : t,
          ),
        }));
      }
    } catch {
      if (!activeController.signal.aborted) {
        get().recordActivity(department, "Simulation failed", "error");
        set((s) => ({
          running: false,
          statuses: { ...initialStatuses(), [department]: "error" },
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: "error" } : t,
          ),
          messages: [
            ...s.messages,
            {
              id: uid(),
              role: "assistant",
              department,
              simulated: true,
              text: "The simulation encountered an error. Try again.",
            },
          ],
        }));
      }
    }
  },
}));
