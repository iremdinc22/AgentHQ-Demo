import type { AgentStatus, DepartmentId, Task } from "../../types";
export type VisualState = "sleeping" | "working" | "completed";
export const personalities: Record<DepartmentId, { phase: number; speed: number; energy: number }> = {
  ceo: { phase: 0, speed: 1.05, energy: 0.8 },
  engineering: { phase: 2.1, speed: 1.2, energy: 0.85 },
  research: { phase: 4.4, speed: 0.8, energy: 0.65 },
  content: { phase: 6.3, speed: 1.15, energy: 1 },
  career: { phase: 8.2, speed: 0.95, energy: 0.8 },
  project: { phase: 10.1, speed: 1, energy: 0.7 },
  knowledge: { phase: 12.5, speed: 0.75, energy: 0.6 },
  game: { phase: 14.2, speed: 1.25, energy: 1.05 },
};
export interface AnimationClock {
  status: AgentStatus; taskId?: string; celebratedAt: number; active: boolean;
  observedActive: boolean; celebrated: boolean;
}
export const celebrationDuration = 1;
export const createAnimationClock = (): AnimationClock => ({ status: "idle", celebratedAt: -Infinity, active: false, observedActive: false, celebrated: false });
export function advanceClock(clock: AnimationClock, status: AgentStatus, task: (Pick<Task,"id"|"status"> & { observedActive?: boolean }) | undefined, now: number, active = status === "working" || status === "waiting_approval") {
  if (clock.taskId !== task?.id) {
    clock.taskId = task?.id;
    clock.celebratedAt = -Infinity;
    clock.status = "idle";
    clock.observedActive = false;
    clock.celebrated = false;
  }
  const failed = status === "error" || task?.status === "error" || task?.status === "cancelled";
  // Observe task outcome as well as agent status: a short completed status can
  // be followed by idle before the next R3F frame. With a task record, wait
  // for its successful outcome so cancellation/failure cannot celebrate early.
  const success = !failed && (clock.observedActive || task?.observedActive === true) && !clock.celebrated &&
    (task ? task.status === "completed" : status === "completed");
  if (success) {
    clock.celebratedAt = now;
    clock.celebrated = true;
  }
  clock.status = status;
  clock.active = !failed && !clock.celebrated && task?.status !== "completed" && active;
  if (clock.active) clock.observedActive = true;
  if (failed) { clock.celebratedAt = -Infinity; clock.observedActive = false; }

}
export interface AnimationPose {
  state: VisualState; bodyY: number; bodyRoll: number; headPitch: number; headYaw: number; headRoll: number;
  eyeOpen: number; leftPaw: number; rightPaw: number; sleep: boolean; sparkle: boolean; cueY: number; earTilt: number; tailYaw: number; gestureSpread: number;
}
export const createPose = (): AnimationPose => ({ state: "sleeping", bodyY: 0, bodyRoll: 0, headPitch: 0, headYaw: 0, headRoll: 0, eyeOpen: 1, leftPaw: 0, rightPaw: 0, sleep: true, sparkle: false, cueY: 0, earTilt: 0, tailYaw: 0, gestureSpread: 0 });
export function samplePose(out: AnimationPose, clock: AnimationClock, kind: DepartmentId, now: number, reduced: boolean, coordinating: boolean, interrupted: boolean) {
  const p = personalities[kind];
  const t = now * p.speed + p.phase;
  const celebration = now - clock.celebratedAt;
  const processing = clock.active && !interrupted;
  const state: VisualState = !interrupted && celebration >= 0 && celebration < celebrationDuration
    ? "completed" : processing ? "working" : "sleeping";
  out.state = state;
  out.bodyY = 0; out.bodyRoll = 0; out.headPitch = 0; out.headYaw = 0; out.headRoll = 0;
  out.leftPaw = 0; out.rightPaw = 0; out.eyeOpen = 1; out.cueY = 0; out.earTilt = 0; out.tailYaw = 0; out.gestureSpread = 0;
  out.sleep = state === "sleeping"; out.sparkle = state === "completed";
  if (state === "sleeping") {
    out.eyeOpen = 0.045;
    out.headPitch = 0.28;
    if (!reduced) {
      out.bodyY = -0.018 + Math.sin(t * 1.2) * 0.007;
      out.headPitch += Math.pow(Math.max(0, Math.sin(t * 0.65)), 8) * 0.035;
      out.cueY = Math.sin(t * 1.5) * 0.035;
    }
    return out;
  }
  // Reduced motion keeps the static sleep/awake distinction and success cue,
  // while removing blinking, floating, jumps and all personality movement.
  if (reduced) return out;
  out.bodyY = Math.sin(t * 1.8) * 0.012;
  const blink = t % 4.7;
  out.eyeOpen = blink < 0.2 ? Math.max(0.06, Math.abs(blink - 0.1) / 0.1) : 1;
  if (state === "working") {
    out.headPitch = Math.sin(t * 2.2) * 0.018;
    out.leftPaw = (0.5 + 0.5 * Math.sin(t * 13)) * 0.055;
    out.rightPaw = (0.5 + 0.5 * Math.sin(t * 13 + Math.PI)) * 0.055;
  }
  if (kind === "ceo" && coordinating && processing) { out.headYaw = Math.sin(t * 1.5) * 0.11; out.rightPaw = 0.08 + Math.max(0, Math.sin(t * 3)) * 0.04; out.gestureSpread = 0.14 * (0.5 + 0.5 * Math.sin(t * 3)); }
  if (state === "completed") {
    const envelope = Math.sin(celebration / celebrationDuration * Math.PI);
    out.bodyY = Math.abs(Math.sin(celebration * 8)) * envelope * 0.09 * p.energy;
    out.bodyRoll = Math.sin(celebration * 8) * envelope * 0.025 * p.energy;
    out.headRoll = Math.sin(celebration * 7) * envelope * 0.06;
  }
  if (state === "working") {
    if (kind === "content") { const twitch = t % 8; out.earTilt = twitch < 0.8 ? Math.sin(twitch / 0.8 * Math.PI * 2) * 0.13 : 0; }
    if (kind === "career") out.tailYaw = Math.sin(t * 3.5) * 0.22;
    if (kind === "research" && state === "working") { const tilt = t % 9; out.headRoll += tilt < 2 ? Math.sin(tilt / 2 * Math.PI) * 0.12 : 0; }
  }
  out.cueY = Math.sin(t * 1.5) * 0.035;
  return out;
}
