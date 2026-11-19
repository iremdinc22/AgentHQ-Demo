import { useOfficeStore } from "../store/useOfficeStore";
import type { DepartmentId, Task } from "../types";

export type AnimationTask = Pick<Task, "id" | "status"> & { department?: DepartmentId };
export const tasksForAgent = (tasks: Task[], agent: DepartmentId) =>
  tasks.filter(task => task.department === agent || task.participants?.includes(agent));

export function useAgentVisual(id: DepartmentId) {
  const status = useOfficeStore(state => state.statuses[id]);
  const task = useOfficeStore(state => state.tasks.find(item => item.department === id || item.participants?.includes(id)));
  return {
    status,
    task: task && status === "completed" && task.status === "running" ? { ...task, status: "completed" as const } : task,
  };
}
