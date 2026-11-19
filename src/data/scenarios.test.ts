import { afterEach, expect, it, vi } from "vitest";
import { scenarioExecution, scenarios } from "./scenarios";
import type { ExecutionEvent } from "../types";

afterEach(() => vi.useRealTimers());

it.each(scenarios)("emits only simulated handoffs for $title and returns the team to idle", async scenario => {
  vi.useFakeTimers();
  const events: ExecutionEvent[] = [];
  const adapter = scenarioExecution(scenario);
  const run = adapter.run(scenario.goal, "ceo", "ceo", event => events.push(event), new AbortController().signal);
  await vi.runAllTimersAsync();
  await run;
  expect(adapter.participants).toEqual(["ceo", ...scenario.stages.flat().map(step => step.agent)]);
  for (const stage of scenario.stages) {
    const start = stage.map(step => events.findIndex(e => e.type === "status" && e.department === step.agent && e.status === "working"));
    const finish = stage.map(step => events.findIndex(e => e.type === "status" && e.department === step.agent && e.status === "completed"));
    expect(Math.min(...start)).toBeGreaterThan(0);
    expect(Math.max(...start)).toBeLessThan(Math.min(...finish));
  }
  for (const participant of adapter.participants ?? []) {
    expect(events.filter(e => e.type === "status" && e.department === participant).at(-1)).toMatchObject({ status: "idle" });
  }
  expect(events.some(e => e.type === "message" && e.text.includes("Simulated handoff complete"))).toBe(true);
});

it("cancels the staged timer without emitting a completed result", async () => {
  vi.useFakeTimers();
  const scenario = scenarios[0];
  const controller = new AbortController();
  const emit = vi.fn();
  const result = scenarioExecution(scenario).run(scenario.goal, "ceo", "ceo", emit, controller.signal);
  const cancelled = expect(result).rejects.toMatchObject({ name: "AbortError" });
  await vi.advanceTimersByTimeAsync(550);
  controller.abort();
  await cancelled;
  await vi.runAllTimersAsync();
  expect(emit.mock.calls.some(([event]) => event.type === "status" && event.status === "completed")).toBe(false);
});
