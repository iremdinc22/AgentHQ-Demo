import { expect, it } from "vitest";
import { Group, Vector3 } from "three";
import { departments } from "../../departments/config";
import { officeLayout, officeBounds } from "../../departments/officeLayout";
import {
  animalYaw,
  deskTop,
  laptopHinge,
  laptopLidAngle,
  laptopScreen,
  laptopScreenCenter,
  laptopHeadPitch,
  pawReach,
  pawHeight,
  seatedAnimal,
  seatedHead,
  headEyeOffset,
  keyboardTarget,
} from "./workstationLayout";
function scene(id: (typeof departments)[number]["id"]) {
  const p = officeLayout[id];
  const station = new Group();
  station.position.set(...p.position);
  station.rotation.y = p.angle;
  station.scale.setScalar(p.workstationScale);
  const lid = new Group();
  lid.position.set(...laptopHinge);
  lid.rotation.x = laptopLidAngle;
  station.add(lid);
  const screen = new Group();
  screen.position.set(...laptopScreen);
  lid.add(screen);
  const actor = new Group();
  actor.position.set(...seatedAnimal);
  actor.rotation.y = animalYaw;
  station.add(actor);
  station.updateMatrixWorld(true);
  return { station, screen, actor };
}
it.each(departments)(
  "$animal sits on the working side of the desk, facing the open laptop",
  (d) => {
    const { station, screen, actor } = scene(d.id);
    const forward = actor.getWorldDirection(new Vector3());
    const toward = screen
      .getWorldPosition(new Vector3())
      .sub(actor.getWorldPosition(new Vector3()))
      .setY(0)
      .normalize();
    expect(forward.dot(toward)).toBeCloseTo(1, 8);
    expect(forward.dot(screen.getWorldDirection(new Vector3()))).toBeLessThan(
      -0.95,
    );
    expect(seatedAnimal[2]).toBeGreaterThan(
      deskTop.center[2] + deskTop.size[2] / 2,
    );
    expect(forward.dot(new Vector3(19, 0, 28).normalize())).toBeGreaterThan(0.85);
    expect(station.scale.x).toBeGreaterThan(1);
  },
);
it.each(departments)(
  "$animal paws reach the laptop key rows rather than a separate keyboard",
  (d) => {
    const { station, actor } = scene(d.id);
    for (const side of [-1, 1]) {
      const paw = actor.localToWorld(
        new Vector3(side * 0.23, pawHeight, pawReach),
      );
      const local = station.worldToLocal(paw);
      expect(Math.abs(local.x)).toBeLessThan(0.325);
      expect(Math.abs(local.y - keyboardTarget[1])).toBeLessThan(0.02);
      expect(Math.abs(local.z - keyboardTarget[2])).toBeLessThan(0.02);
    }
  },
);
it.each(departments)(
  "$animal looks down at the actual tilted laptop display",
  () => {
    const pitch = laptopHeadPitch();
    const eye = new Vector3(...headEyeOffset)
      .applyAxisAngle(new Vector3(1, 0, 0), pitch)
      .add(new Vector3(...seatedHead))
      .applyAxisAngle(new Vector3(0, 1, 0), animalYaw)
      .add(new Vector3(...seatedAnimal));
    const gaze = new Vector3(0, 0, 1)
      .applyAxisAngle(new Vector3(1, 0, 0), pitch)
      .applyAxisAngle(new Vector3(0, 1, 0), animalYaw);
    expect(gaze.dot(laptopScreenCenter().sub(eye).normalize())).toBeCloseTo(
      1,
      7,
    );
    expect(pitch).toBeGreaterThan(0);
    expect(pitch).toBeLessThan(0.3);
  },
);
it("keeps department architecture separate and CEO substantially larger", () => {
  const rooms = Object.entries(officeLayout);
  const ceoArea = officeLayout.ceo.width * officeLayout.ceo.depth;
  for (let i = 0; i < rooms.length; i++) {
    const [id, a] = rooms[i];
    expect(Math.abs(a.position[0]) + a.width / 2).toBeLessThan(
      officeBounds.width / 2,
    );
    expect(Math.abs(a.position[2]) + a.depth / 2).toBeLessThan(
      officeBounds.depth / 2,
    );
    if (id !== "ceo")
      expect(ceoArea / (a.width * a.depth)).toBeGreaterThan(1.8);
    for (const [, b] of rooms.slice(i + 1))
      expect(
        Math.abs(a.position[0] - b.position[0]) < (a.width + b.width) / 2 &&
          Math.abs(a.position[2] - b.position[2]) < (a.depth + b.depth) / 2,
      ).toBe(false);
  }
});
