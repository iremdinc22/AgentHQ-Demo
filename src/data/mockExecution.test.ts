import { afterEach, expect, it, vi } from "vitest";
import { mockExecution } from "./mockExecution";
import type { ExecutionEvent } from "../types";
afterEach(() => vi.useRealTimers());
it("demonstrates a CEO research and content handoff then returns all agents to idle", async () => {
  vi.useFakeTimers();
  const events: ExecutionEvent[] = [];
  const done = mockExecution.run(
    "An idea",
    "ceo",
    "ceo",
    (e) => events.push(e),
    new AbortController().signal,
  );
  await vi.runAllTimersAsync();
  await done;
  const statuses = events.filter((e) => e.type === "status");
  expect(statuses).toContainEqual({
    type: "status",
    department: "research",
    status: "working",
  });
  expect(statuses).toContainEqual({
    type: "status",
    department: "content",
    status: "waiting_approval",
  });
  expect(statuses.slice(-3)).toEqual(
    ["ceo", "research", "content"].map((department) => ({
      type: "status",
      department,
      status: "idle",
    })),
  );
  expect(events.filter((e) => e.type === "message").at(-1)).toMatchObject({
    text: expect.stringContaining(
      "No research, article, repository analysis, or file changes were performed",
    ),
  });
});
it("aborts timers without delivering subsequent workflow events", async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  const events: ExecutionEvent[] = [];
  const done = mockExecution.run(
    "An idea",
    "ceo",
    "ceo",
    (e) => events.push(e),
    controller.signal,
  );
  const assertion = expect(done).rejects.toMatchObject({ name: "AbortError" });
  controller.abort();
  await assertion;
  await vi.runAllTimersAsync();
  expect(events).toHaveLength(2);
  expect(vi.getTimerCount()).toBe(0);
});
