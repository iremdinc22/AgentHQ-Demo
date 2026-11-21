import { create } from "zustand";
import type { DepartmentId } from "../types";
import { useOfficeStore } from "./useOfficeStore";
export type ReviewStatus = "pending" | "approved" | "rejected";
export interface Approval {
  id: string; title: string; department: DepartmentId; summary: string;
  preview?: string; taskId?: string; createdAt?: number;
  simulated: true; status: ReviewStatus; decidedAt?: number; rejectionReason?: string;
}
export const sampleApprovals = (): Approval[] => [
  { id: "sample-research", title: "Research brief", department: "research", summary: "A proposed research approach and a checklist for verifying sources.", preview: "Proposed demo approach: gather context, verify evidence, and prepare a source checklist. No research or file changes have been performed.", simulated: true, status: "pending" },
  { id: "sample-content", title: "Article outline", department: "content", summary: "A proposed structure, from the first idea to the final paragraph.", preview: "Proposed demo outline: introduce the idea, organize the main points, and draft a conclusion for human review. No writing or file changes have been performed.", simulated: true, status: "pending" },
];
export const pendingReviews = (requests: Approval[]) => requests.filter(r => r.status === "pending");
export const decisionHistory = (requests: Approval[], filter: "all" | "approved" | "rejected" = "all") => requests.filter(r => r.status !== "pending" && (filter === "all" || r.status === filter)).sort((a,b) => (b.decidedAt ?? 0) - (a.decidedAt ?? 0));
export const canDecide = (request: Approval) => request.status === "pending";
interface ReviewStore {
  requests: Approval[];
  request: (approval: Approval) => void;
  withdraw: (id: string) => void;
  decide: (id: string, status: "approved" | "rejected", reason?: string) => void;
}
export const useReviewStore = create<ReviewStore>((set, get) => ({
  requests: sampleApprovals(),
  request: approval => set(s => ({ requests: [approval, ...s.requests] })),
  withdraw: id => set(s => ({ requests: s.requests.filter(r => r.id !== id || r.status !== "pending") })),
  decide: (id, status, reason) => {
    const request = get().requests.find(r => r.id === id);
    if (!request || !canDecide(request)) return;
    const rejectionReason = status === "rejected" ? reason?.trim().slice(0, 1000) || undefined : undefined;
    set(s => ({ requests: s.requests.map(r => r.id === id ? {...r, status, decidedAt: Date.now(), rejectionReason} : r) }));
    useOfficeStore.getState().recordActivity(request.department, `${request.title}: ${status} (simulated decision; no ${request.taskId ? "real " : ""}execution authorized)${rejectionReason ? ` — ${rejectionReason}` : ""}`, "approval");
  },
}));
