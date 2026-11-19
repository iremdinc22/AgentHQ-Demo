import type { ExecutionAdapter } from "../types";
export const pause = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  });
export const mockExecution: ExecutionAdapter = {
  async run(prompt, mode, department, emit, signal) {
    const lead = mode === "ceo" ? "ceo" : department;
    emit({ type: "status", department: lead, status: "working" });
    emit({
      type: "activity",
      department: lead,
      text: "Simulated request received",
    });
    await pause(850, signal);
    if (mode === "ceo") {
      emit({
        type: "message",
        department: "ceo",
        text: "Simulation: I’m asking Research to outline the evidence, then Content to shape a draft.",
      });
      emit({ type: "status", department: "research", status: "working" });
      emit({
        type: "activity",
        department: "research",
        text: "Simulating an evidence outline",
      });
      await pause(1600, signal);
      emit({ type: "status", department: "research", status: "completed" });
      emit({ type: "status", department: "content", status: "working" });
      emit({
        type: "activity",
        department: "content",
        text: "Simulating a writing handoff",
      });
      await pause(1600, signal);
      emit({
        type: "status",
        department: "content",
        status: "waiting_approval",
      });
      emit({
        type: "message",
        department: "ceo",
        text: `Simulated result for “${prompt}”: Research would compare sources and document uncertainties; Content would prepare an introduction, comparison, and conclusion. This is a workflow preview. No research, article, repository analysis, or file changes were performed. The approval indicator is a visual preview only.`,
      });
      await pause(1400, signal);
      emit({ type: "status", department: "content", status: "completed" });
    } else {
      await pause(1200, signal);
      emit({
        type: "message",
        department,
        text: `Simulated response to “${prompt}”: I would clarify your goal, review the supplied context, and propose a plan for approval. No external sources, repositories, or files were accessed.`,
      });
    }
    emit({ type: "status", department: lead, status: "completed" });
    emit({
      type: "activity",
      department: lead,
      text: "Simulation completed · no real work executed",
    });
    await pause(900, signal);
    for (const d of new Set([
      lead,
      ...(mode === "ceo" ? (["research", "content"] as const) : []),
    ]))
      emit({ type: "status", department: d, status: "idle" });
  },
};
