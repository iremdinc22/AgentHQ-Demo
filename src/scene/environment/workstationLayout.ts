import { Vector3 } from "three";
export type Point = [number, number, number];
// One complete, declarative laptop station. +Z is the seated worker's side.
export const seatedAnimal: Point = [0, 0.25, 0.68];
export const chairSeat: Point = [0, 0.4, 0.03];
export const chairBack: Point = [0, 0.67, 0.44];
export const seatedHead: Point = [0, 0.99, 0.1];
export const headEyeOffset: Point = [0, 0.03, 0.32];
export const deskTop = {
  center: [0, 0.78, -0.22] as Point,
  size: [2.15, 0.13, 1.1] as Point,
};
export const laptopHinge: Point = [0, 0.89, -0.45];
export const laptopLidAngle = -0.22;
export const laptopScreen: Point = [0, 0.285, 0.021];
export const keyboardTarget: Point = [0, 0.895, -0.04];
export const pawReach = 0.72;
export const pawHeight = 0.64;
export const animalYaw = Math.PI;
export function laptopScreenCenter() {
  return new Vector3(...laptopScreen)
    .applyAxisAngle(new Vector3(1, 0, 0), laptopLidAngle)
    .add(new Vector3(...laptopHinge));
}
export function laptopHeadPitch() {
  const surface = laptopScreenCenter();
  const vertical = surface.y - seatedAnimal[1] - seatedHead[1];
  const distance = seatedAnimal[2] - surface.z - seatedHead[2];
  return (
    Math.asin(headEyeOffset[1] / Math.hypot(distance, vertical)) -
    Math.atan2(vertical, distance)
  );
}
