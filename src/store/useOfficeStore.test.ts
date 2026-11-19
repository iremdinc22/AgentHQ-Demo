import { beforeEach, expect, it } from "vitest";
import { useOfficeStore } from "./useOfficeStore";
import type { ExecutionAdapter } from "../types";
const initial = useOfficeStore.getState();
beforeEach(() => {
  useOfficeStore.getState().cancel();
  useOfficeStore.setState(initial, true);
});
it("routes direct requests to the selected department and completes via adapter events", async () => {
  const store = useOfficeStore.getState();
  store.select("engineering");
  store.setMode("direct");
  const adapter: ExecutionAdapter = {
    async run(prompt, mode, department, emit) {
      expect(mode).toBe("direct");
      expect(department).toBe("engineering");
      expect(prompt).toBe("Review project");
      emit({ type: "status", department, status: "working" });
      emit({ type: "message", department, text: "Simulated result" });
    },
  };
  await store.submit(" Review project ", adapter);
  expect(useOfficeStore.getState().tasks[0].status).toBe("completed");
  expect(useOfficeStore.getState().tasks[0].createdAt).toBeGreaterThan(0);
  expect(useOfficeStore.getState().tasks[0].mode).toBe("direct");
  expect(useOfficeStore.getState().messages.at(-1)?.taskId).toBe(useOfficeStore.getState().tasks[0].id);
  expect(useOfficeStore.getState().activities.some(a => a.category === "task" && a.text.includes("created"))).toBe(true);
  expect(useOfficeStore.getState().messages.at(-1)?.department).toBe(
    "engineering",
  );
});
it("blocks overlapping and empty tasks", async () => {
  let release!: () => void;
  const adapter: ExecutionAdapter = {
    run: () =>
      new Promise((r) => {
        release = r;
      }),
  };
  await initial.submit(" ");
  expect(useOfficeStore.getState().tasks).toHaveLength(0);
  const pending = initial.submit("one", adapter);
  await initial.submit("two", adapter);
  expect(useOfficeStore.getState().tasks).toHaveLength(1);
  release();
  await pending;
});
it("cancels without allowing stale events to alter state", async () => {
  const adapter: ExecutionAdapter = {
    run: async (_, __, department, emit, signal) => {
      await new Promise<void>((resolve) =>
        signal.addEventListener("abort", () => resolve(), { once: true }),
      );
      emit({ type: "status", department, status: "completed" });
    },
  };
  const pending = initial.submit("cancel me", adapter);
  initial.cancel();
  await pending;
  expect(useOfficeStore.getState().statuses.ceo).toBe("idle");
  expect(useOfficeStore.getState().tasks[0].status).toBe("cancelled");
  expect(useOfficeStore.getState().activities[0].text).toBe("Task cancelled");
});
it("surfaces adapter failures as simulation errors", async () => {
  await initial.submit("test", {
    run: async () => {
      throw new Error("test");
    },
  });
  expect(useOfficeStore.getState().statuses.ceo).toBe("error");
  expect(useOfficeStore.getState().running).toBe(false);
  expect(useOfficeStore.getState().activities[0].category).toBe("error");
});
it("makes every overview request observable while preserving department selection", () => {
  initial.select("research");
  initial.overview();
  const first = useOfficeStore.getState();
  expect(first.selected).toBe("research");
  expect(first.focusVersion).toBe(0);
  initial.overview();
  expect(useOfficeStore.getState().cameraResetVersion).toBe(
    first.cameraResetVersion + 1,
  );
});

it("routes the office composer to the CEO without changing direct chat mode", async () => {
  initial.select("engineering");
  initial.setMode("direct");
  await initial.submit("Plan a demo", {
    async run(_prompt, mode, department) {
      expect(mode).toBe("ceo");
      expect(department).toBe("ceo");
    },
  }, "ceo");
  const state = useOfficeStore.getState();
  expect(state.tasks[0]).toMatchObject({ mode: "ceo", department: "ceo" });
  expect(state.mode).toBe("direct");
  expect(state.selected).toBe("engineering");
});
