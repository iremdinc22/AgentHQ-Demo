import type { DepartmentId } from "../types";
export interface RoomPlan {
  position: [number, number, number];
  width: number;
  depth: number;
  wallHeight: number;
  wall: string;
  floor: string;
  rug: string;
  desk: [number, number];
  angle: number;
  workstationScale: number;
}
// A courtyard plan: three rear studios, two wings, and two wider front rooms.
// Yaw turns the complete laptop/desk/chair/animal rig for readable faces.
export const officeLayout: Record<DepartmentId, RoomPlan> = {
  ceo: {
    position: [0, 0, 0],
    width: 11.4,
    depth: 9.2,
    wallHeight: 0.8,
    wall: "#b58d58",
    floor: "#eee2c9",
    rug: "#bf7751",
    desk: [0.6, -0.85],
    angle: -2.18,
    workstationScale: 1.45,
  },
  engineering: {
    position: [-9.5, 0, 0],
    width: 6.8,
    depth: 7.6,
    wallHeight: 2.05,
    wall: "#527f76",
    floor: "#deded0",
    rug: "#5b8e7a",
    desk: [0.5, -0.7],
    angle: -2.05,
    workstationScale: 1.3,
  },
  research: {
    position: [-8.1, 0, -8.3],
    width: 7.8,
    depth: 6.2,
    wallHeight: 2.2,
    wall: "#699c85",
    floor: "#e3e3cd",
    rug: "#6f9870",
    desk: [0.6, -0.35],
    angle: -2.25,
    workstationScale: 1.3,
  },
  content: {
    position: [0, 0, -8.3],
    width: 7.8,
    depth: 6.2,
    wallHeight: 2.2,
    wall: "#cb8066",
    floor: "#f0dfc9",
    rug: "#ce8c58",
    desk: [-0.7, -0.4],
    angle: -2.12,
    workstationScale: 1.3,
  },
  career: {
    position: [8.1, 0, -8.3],
    width: 7.8,
    depth: 6.2,
    wallHeight: 2.2,
    wall: "#c19b4e",
    floor: "#efe1c6",
    rug: "#c29c4f",
    desk: [0.9, -0.5],
    angle: -2.28,
    workstationScale: 1.3,
  },
  project: {
    position: [9.5, 0, 0],
    width: 6.8,
    depth: 7.6,
    wallHeight: 1.95,
    wall: "#658eaa",
    floor: "#e2e5dc",
    rug: "#5f96a8",
    desk: [0.4, -0.7],
    angle: -2.5,
    workstationScale: 1.3,
  },
  knowledge: {
    position: [-5.6, 0, 8.2],
    width: 9.6,
    depth: 6,
    wallHeight: 1.65,
    wall: "#8c9d61",
    floor: "#e8dfc6",
    rug: "#84974c",
    desk: [1.5, -0.5],
    angle: -2.22,
    workstationScale: 1.3,
  },
  game: {
    position: [5.1, 0, 8.2],
    width: 9.6,
    depth: 6,
    wallHeight: 1.65,
    wall: "#9882af",
    floor: "#e5dcdf",
    rug: "#9271a5",
    desk: [-1, -0.5],
    angle: -2.14,
    workstationScale: 1.3,
  },
};
export const officeBounds = { width: 28, depth: 24.4 };
