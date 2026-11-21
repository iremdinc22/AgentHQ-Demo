import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { scenarios } from "../../data/scenarios";
import { useOfficeStore } from "../../store/useOfficeStore";
import { useReviewStore } from "../../store/useReviewStore";
import { reviewedScenario } from "./workflows";

const office = useOfficeStore.getState();
const reviews = useReviewStore.getState();
beforeEach(() => {
  useOfficeStore.setState(office, true);
  useReviewStore.setState(reviews, true);
  vi.useFakeTimers();
});
afterEach(() => { useOfficeStore.getState().cancel(); vi.useRealTimers(); });

function start(scenario = scenarios[0]) {
  const pending = office.submit(scenario.goal, reviewedScenario(scenario), "ceo");
  const task = useOfficeStore.getState().tasks[0];
  const review = useReviewStore.getState().requests.find(item => item.taskId === task.id)!;
  return { pending, task, review };
}

it.each(scenarios)("waits for review and completes $id through its configured stages", async scenario => {
  const { pending, task, review } = start(scenario);
  await vi.advanceTimersByTimeAsync(10000);
  expect(useOfficeStore.getState().statuses.ceo).toBe("waiting_approval");
  expect(useOfficeStore.getState().messages.some(message => message.taskId === task.id)).toBe(false);
  reviews.decide(review.id, "approved");
  await vi.advanceTimersByTimeAsync(500);
  for (const step of scenario.stages[0]) {
    expect(useOfficeStore.getState().statuses[step.agent]).toBe("working");
  }
  for (const step of scenario.stages.slice(1).flat()) {
    expect(useOfficeStore.getState().statuses[step.agent]).toBe("idle");
  }
  await vi.runAllTimersAsync();
  await pending;
  const state = useOfficeStore.getState();
  expect(state.tasks[0].status).toBe("completed");
  expect(state.messages.filter(m => m.taskId === task.id && m.text.startsWith("Synthetic result:")).map(m => m.department))
    .toEqual(scenario.stages.flat().map(step => step.agent));
  expect(state.activities.some(event => event.taskId === task.id && event.text.includes("handoff started"))).toBe(true);
});

it("keeps a rejection in history and prevents specialist work", async () => {
  const { pending, task, review } = start();
  reviews.decide(review.id, "rejected", "Revise plan");
  await pending;
  expect(useOfficeStore.getState().tasks[0].status).toBe("cancelled");
  expect(useOfficeStore.getState().messages.some(message => message.taskId === task.id)).toBe(false);
  expect(useReviewStore.getState().requests[0].status).toBe("rejected");
});

it("withdraws pending review on cancellation and ignores later approval", async () => {
  const { pending, review } = start();
  office.cancel();
  await pending;
  reviews.decide(review.id, "approved");
  expect(useReviewStore.getState().requests.some(item => item.id === review.id)).toBe(false);
  expect(useOfficeStore.getState().tasks[0].status).toBe("cancelled");
});
