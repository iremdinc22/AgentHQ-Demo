import { scenarioExecution, scenarios } from "../../data/scenarios";
import { useOfficeStore } from "../../store/useOfficeStore";
import { useReviewStore } from "../../store/useReviewStore";
import type { ExecutionAdapter } from "../../types";

export function reviewedScenario(scenario: (typeof scenarios)[number]): ExecutionAdapter {
  const execution = scenarioExecution(scenario);
  return {
    ...execution,
    async run(prompt, mode, department, emit, signal) {
      const task = useOfficeStore.getState().tasks[0];
      if (!task || signal.aborted) return;
      const id = "workflow-" + task.id;
      emit({ type: "status", department: "ceo", status: "waiting_approval" });
      emit({ type: "activity", department: "ceo", text: "Plan ready for simulated approval" });
      useReviewStore.getState().request({
        id, taskId: task.id, title: scenario.title, department: "ceo",
        summary: "Review the plan before the specialist team starts.",
        preview: scenario.stages.map(stage => stage.map(step => step.action).join(" + ")).join(" → "),
        createdAt: Date.now(), status: "pending", simulated: true,
      });
      const accepted = await new Promise<boolean>(resolve => {
        const finish = (approved: boolean) => {
          unsubscribe();
          signal.removeEventListener("abort", abort);
          resolve(approved);
        };
        const abort = () => finish(false);
        const check = () => {
          const review = useReviewStore.getState().requests.find(item => item.id === id);
          if (review?.status !== "pending") finish(review?.status === "approved");
        };
        const unsubscribe = useReviewStore.subscribe(check);
        signal.addEventListener("abort", abort, { once: true });
        if (signal.aborted) abort(); else check();
      });
      if (!accepted || signal.aborted) {
        useReviewStore.getState().withdraw(id);
        if (!signal.aborted) useOfficeStore.getState().cancel();
        return;
      }
      emit({ type: "activity", department: "ceo", text: "Plan approved · specialist handoff started" });
      await execution.run(prompt, mode, department, emit, signal);
    },
  };
}
