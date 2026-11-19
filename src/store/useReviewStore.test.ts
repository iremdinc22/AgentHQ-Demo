import { beforeEach, expect, it, vi } from "vitest";
import { canDecide, decisionHistory, pendingReviews, sampleApprovals, useReviewStore } from "./useReviewStore";
import { useOfficeStore } from "./useOfficeStore";
beforeEach(() => { useReviewStore.setState({requests:sampleApprovals()}); useOfficeStore.setState({activities:[],tasks:[],running:false}); });
it("approves pending requests and retains metadata in history",()=>{
 useReviewStore.getState().decide("sample-research","approved"); const requests=useReviewStore.getState().requests;
 expect(pendingReviews(requests).map(r=>r.id)).toEqual(["sample-content"]);
 expect(decisionHistory(requests)[0]).toMatchObject({id:"sample-research",status:"approved",simulated:true});
 expect(decisionHistory(requests)[0].decidedAt).toBeGreaterThan(0);
});
it.each([undefined,"","  Needs clearer sources  "])("rejects with optional reason %s",reason=>{
 useReviewStore.getState().decide("sample-research","rejected",reason);
 expect(decisionHistory(useReviewStore.getState().requests)[0]).toMatchObject({status:"rejected",rejectionReason:reason?.trim()||undefined});
});
it("filters decisions and excludes pending requests",()=>{
 useReviewStore.getState().decide("sample-research","approved"); useReviewStore.getState().decide("sample-content","rejected"); const requests=useReviewStore.getState().requests;
 expect(decisionHistory(requests)).toHaveLength(2);
 expect(decisionHistory(requests,"approved").map(r=>r.id)).toEqual(["sample-research"]);
 expect(decisionHistory(requests,"rejected").map(r=>r.id)).toEqual(["sample-content"]);
});
it("synchronizes shared queue and header counter subscribers immediately",()=>{
 const counts:number[]=[]; const unsubscribe=useReviewStore.subscribe(s=>counts.push(pendingReviews(s.requests).length));
 useReviewStore.getState().decide("sample-content","approved"); useReviewStore.getState().decide("sample-research","rejected"); unsubscribe();
 expect(counts).toEqual([1,0]);expect(decisionHistory(useReviewStore.getState().requests)).toHaveLength(2);
});
it("records one simulated event and ignores duplicate, conflicting or stale actions",()=>{
 const decide=useReviewStore.getState().decide; decide("sample-research","approved");decide("sample-research","approved");decide("sample-research","rejected","overwrite");decide("missing","rejected");
 expect(useOfficeStore.getState().activities).toHaveLength(1);
 expect(useOfficeStore.getState().activities[0]).toMatchObject({department:"research",category:"approval",simulated:true});
 expect(decisionHistory(useReviewStore.getState().requests)[0].status).toBe("approved");
});
it("keeps historical details read-only and retains decisions across navigation state",()=>{
 useReviewStore.getState().decide("sample-research","rejected");const request=decisionHistory(useReviewStore.getState().requests)[0];
 expect(canDecide(request)).toBe(false); useOfficeStore.getState().select("engineering");useOfficeStore.getState().overview();
 expect(decisionHistory(useReviewStore.getState().requests)[0]).toBe(request);
 expect(canDecide(pendingReviews(useReviewStore.getState().requests)[0])).toBe(true);
});
it("never invokes execution or alters tasks, messages, statuses",()=>{
 const submit=vi.spyOn(useOfficeStore.getState(),"submit");const before=useOfficeStore.getState();
 useReviewStore.getState().decide("sample-research","approved");useReviewStore.getState().decide("sample-content","rejected","no");const after=useOfficeStore.getState();
 expect(submit).not.toHaveBeenCalled();expect(after.tasks).toBe(before.tasks);expect(after.messages).toBe(before.messages);expect(after.statuses).toBe(before.statuses);expect(after.running).toBe(false);
 expect(after.activities.every(a=>a.text.includes("no execution authorized"))).toBe(true);submit.mockRestore();
});
it("does not fabricate task links or creation dates for legacy samples",()=>{
 expect(sampleApprovals().every(r=>r.taskId===undefined&&r.createdAt===undefined)).toBe(true);
});
