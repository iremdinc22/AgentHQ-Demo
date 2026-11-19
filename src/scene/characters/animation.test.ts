import { expect, it } from "vitest";
import { departments } from "../../departments/config";
import { advanceClock, celebrationDuration, createAnimationClock, createPose, samplePose } from "./animation";
const poseAt = (clock: ReturnType<typeof createAnimationClock>, now: number, reduced=false) => samplePose(createPose(),clock,"ceo",now,reduced,false,false);
it.each(departments)("$animal always sleeps without a task, works continuously, celebrates once and sleeps again",d=>{
 const clock=createAnimationClock(); const pose=createPose();
 for (const now of [0,1,5,23,30,34,100,10000]) {
  samplePose(pose,clock,d.id,now,false,false,false);
  expect(pose.state).toBe("sleeping");expect(pose.sleep).toBe(true);expect(pose.eyeOpen).toBeLessThan(0.1);expect(pose.headPitch).toBeGreaterThanOrEqual(0.28);
 }
 advanceClock(clock,"working",{id:"one",status:"running"},101);
 for (const now of [101.1,102.6,104,110]) {
  samplePose(pose,clock,d.id,now,false,false,false);
  expect(pose.state).toBe("working");expect(pose.sleep).toBe(false);expect(pose.leftPaw+pose.rightPaw).toBeCloseTo(0.055);
 }
 advanceClock(clock,"waiting_approval",{id:"one",status:"running"},111);
 expect(samplePose(pose,clock,d.id,111.1,false,false,false).state).toBe("working");
 advanceClock(clock,"idle",{id:"one",status:"completed"},112);
 expect(samplePose(pose,clock,d.id,112.3,false,false,false).state).toBe("completed");expect(pose.sparkle).toBe(true);
 expect(samplePose(pose,clock,d.id,112+celebrationDuration,false,false,false).state).toBe("sleeping");
 advanceClock(clock,"working",{id:"one",status:"completed"},114);advanceClock(clock,"completed",{id:"one",status:"completed"},115);
 expect(samplePose(pose,clock,d.id,115.1,false,false,false).state).toBe("sleeping");
});
it.each(["cancelled","error"] as const)("%s immediately returns to sleeping with no celebration",outcome=>{
 const clock=createAnimationClock();advanceClock(clock,"working",{id:"a",status:"running"},1);
 advanceClock(clock,"completed",{id:"a",status:"running"},2);
 expect(poseAt(clock,2.1).sparkle).toBe(false);
 advanceClock(clock,"idle",{id:"a",status:outcome},3);
 expect(poseAt(clock,3.1).state).toBe("sleeping");expect(poseAt(clock,3.1).sparkle).toBe(false);
 advanceClock(clock,"working",{id:"b",status:"running"},4);expect(poseAt(clock,4.1).state).toBe("working");
});
it("task assignment keeps its lead working through transient idle/completed statuses",()=>{
 const clock=createAnimationClock();advanceClock(clock,"idle",{id:"a",status:"running"},1,true);
 expect(poseAt(clock,1.1).state).toBe("working");
 advanceClock(clock,"completed",{id:"a",status:"running"},2,true);expect(poseAt(clock,2.1).state).toBe("working");
 advanceClock(clock,"idle",{id:"a",status:"completed"},3,false);expect(poseAt(clock,3.1).state).toBe("completed");
});
it("queued delegates remain asleep until their own agent becomes active",()=>{
 const clock=createAnimationClock();advanceClock(clock,"idle",{id:"handoff",status:"running"},1,false);
 expect(poseAt(clock,1.1).state).toBe("sleeping");
 advanceClock(clock,"working",{id:"handoff",status:"running"},2,true);expect(poseAt(clock,2.1).state).toBe("working");
 advanceClock(clock,"completed",{id:"handoff",status:"running"},3,false);expect(poseAt(clock,3.1).state).toBe("sleeping");
});
it("unrelated agents remain asleep throughout another task",()=>{
 const clocks=departments.map(()=>createAnimationClock());const lead=departments.findIndex(d=>d.id==="engineering");
 advanceClock(clocks[lead],"working",{id:"direct",status:"running"},1,true);
 for(const now of [1.1,2,10]) departments.forEach((d,i)=>expect(samplePose(createPose(),clocks[i],d.id,now,false,false,false).state).toBe(i===lead?"working":"sleeping"));
});
it("does not replay historical success on mount and supports status-only sources",()=>{
 const clock=createAnimationClock();advanceClock(clock,"completed",{id:"old",status:"completed"},10);expect(poseAt(clock,10.1).state).toBe("sleeping");
 const statusOnly=createAnimationClock();advanceClock(statusOnly,"working",undefined,1);advanceClock(statusOnly,"completed",undefined,2);expect(poseAt(statusOnly,2.1).state).toBe("completed");expect(poseAt(statusOnly,3.1).state).toBe("sleeping");
});
it("reduced motion retains static closed eyes, lowered head and Zzz, with no floating",()=>{
 const clock=createAnimationClock();const first=poseAt(clock,1,true);const second=poseAt(clock,9,true);
 expect(first).toEqual(second);expect(first.state).toBe("sleeping");expect(first.sleep).toBe(true);expect(first.headPitch).toBe(0.28);expect(first.eyeOpen).toBe(0.045);expect(first.cueY).toBe(0);
 advanceClock(clock,"working",{id:"a",status:"running"},10);
 const working=poseAt(clock,10.1,true);expect(working.eyeOpen).toBe(1);expect(working.sleep).toBe(false);expect(working.leftPaw+working.rightPaw).toBe(0);
 advanceClock(clock,"idle",{id:"a",status:"completed"},11);const success=poseAt(clock,11.2,true);
 expect(success.bodyY).toBe(0);expect(success.sparkle).toBe(true);expect(poseAt(clock,12.1,true).sleep).toBe(true);
});
it("preserves bounded working personalities and suppresses them in sleep/reduced motion",()=>{
 for(const d of departments){
  const clock=createAnimationClock();advanceClock(clock,"working",{id:"a",status:"running"},0);
  const p=samplePose(createPose(),clock,d.id,1,false,true,false);
  expect(Math.abs(p.tailYaw)).toBeLessThanOrEqual(0.22);expect(Math.abs(p.earTilt)).toBeLessThanOrEqual(0.13);
  if(d.id==="ceo")expect(p.gestureSpread).toBeGreaterThan(0);
  const reduced=samplePose(createPose(),clock,d.id,1,true,true,false);expect([reduced.earTilt,reduced.tailYaw,reduced.gestureSpread,reduced.headRoll]).toEqual([0,0,0,0]);
  const sleeping=samplePose(createPose(),createAnimationClock(),d.id,1,false,true,false);expect([sleeping.earTilt,sleeping.tailYaw,sleeping.gestureSpread]).toEqual([0,0,0]);
 }
});
