import { useAgentVisual } from "../agentVisuals";
import { CozyDetails } from "./CozyDetails";
import { Html } from "@react-three/drei";
import { memo, useState, type RefObject } from "react";
import { useOfficeStore } from "../../store/useOfficeStore";
import type { Department } from "../../types";
import { officeLayout } from "../../departments/officeLayout";
import { Workstation } from "./Workstation";
import { Box } from "./Furniture";
import { Rug, Tree } from "./Decor";
import { FloorLabel } from "./FloorLabel";
import { Interiors } from "./Interiors";
export const Workspace = memo(function Workspace({
  department: d,
  portal,
}: {
  department: Department;
  portal: RefObject<HTMLDivElement>;
}) {
  const selected = useOfficeStore((s) => s.selected === d.id);
  const { status, task } = useAgentVisual(d.id);
  const coordinating = useOfficeStore(s => d.id === "ceo" && s.running && s.tasks[0]?.mode === "ceo" && Object.entries(s.statuses).some(([agent, state]) => agent !== "ceo" && state === "working"));
  const select = useOfficeStore((s) => s.select);
  const [hover, setHover] = useState(false);
  const p = officeLayout[d.id];
  const w = p.width,
    h = p.wallHeight,
    depth = p.depth;
  const ceo = d.id === "ceo";
  return (
    <group
      position={d.position}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta > 4) return; // Orbit gestures must not also select a room.
        select(d.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <Box position={[0, 0.04, 0]} size={[w, 0.14, depth]} color={p.floor} />
      {/* Fine floor joints bring scale to the larger rooms without textures. */}
      {Array.from({ length: Math.floor(w) }, (_, i) => (
        <Box
          key={i}
          position={[-w / 2 + 0.65 + i, 0.115, 0]}
          size={[0.015, 0.008, depth - 0.12]}
          color="#d1c5ae"
        />
      ))}
      {!ceo && (
        <>
          <Box
            position={[0, h / 2 + 0.12, -depth / 2]}
            size={[w, h, 0.15]}
            color={p.wall}
          />
          <Box
            position={[-w / 2, h / 2 + 0.12, -depth * 0.2]}
            size={[0.15, h, depth * 0.6]}
            color={p.wall}
          />
          <Box
            position={[0, h + 0.15, -depth / 2]}
            size={[w + 0.08, 0.07, 0.19]}
            color="#e9d8b6"
          />
          <Box
            position={[-w / 2, h + 0.15, -depth * 0.2]}
            size={[0.19, 0.07, depth * 0.6]}
            color="#e9d8b6"
          />
          <Box
            position={[0, 0.23, -depth / 2 + 0.1]}
            size={[w - 0.1, 0.17, 0.06]}
            color="#e8d8bb"
          />
          <Box
            position={[-w / 2 + 0.1, 0.23, -depth * 0.2]}
            size={[0.06, 0.17, depth * 0.6]}
            color="#e8d8bb"
          />
        </>
      )}
      {!ceo && <>
        <Box position={[-w / 2, h / 2 + 0.12, depth * 0.1]} size={[0.21, h + 0.05, 0.21]} color="#dac5a2" />
        <Box position={[w / 2, h / 2 + 0.12, -depth / 2]} size={[0.21, h + 0.05, 0.21]} color="#dac5a2" />
        <Box position={[0, 0.13, depth / 2 - 0.08]} size={[w - 0.3, 0.02, 0.24]} color="#dfcba6" />
      </>}
      {ceo && (
        <>
          <Box
            position={[0, 0.44, -depth / 2]}
            size={[w, 0.65, 0.14]}
            color="#b79c6b"
          />
          {[-1, 1].map((s) => (
            <group key={s}>
              <Box
                position={[(s * w) / 2, 0.42, -0.8]}
                size={[0.08, 0.7, depth * 0.7]}
                color="#b99c6e"
              />
              <Box
                position={[(s * w) / 2, 0.81, -0.8]}
                size={[0.12, 0.08, depth * 0.7]}
                color="#e7d1a5"
              />
            </group>
          ))}
        </>
      )}
      <group position={[ceo ? 1.15 : 0, 0, 0.7]}>
        <Rug
          width={ceo ? 5.1 : w * 0.6}
          depth={ceo ? 4.5 : 2.2}
          color={p.rug}
          pattern={
            ceo ? "stripes" : d.id === "engineering"
              ? "grid"
              : d.id === "knowledge"
                ? "stripes"
                : "diamonds"
          }
        />
      </group>
      <group
        position={[p.desk[0], 0.14, p.desk[1]]}
        rotation={[0, p.angle, 0]}
        scale={p.workstationScale}
      >
        <Workstation kind={d.id} status={status} task={task} coordinating={coordinating} />
      </group>
      <Interiors kind={d.id} />
      <CozyDetails kind={d.id} />
      <FloorLabel text={d.name} width={w} depth={depth} />
      {!ceo && (
        <Tree
          position={[w / 2 - 0.38, 0.14, -depth / 2 + 0.38]}
          scale={0.62}
          pot={d.id === "game" ? "#b48265" : "#c99b6e"}
        />
      )}
      <Box
        position={[0, 0.15, depth / 2]}
        size={[w, 0.04, 0.08]}
        color={selected || hover ? "#bd8252" : "#cbb68d"}
      />
      <Html
        portal={portal}
        position={[
          ceo ? p.desk[0] : 0.35,
          ceo ? 3.4 : h + 0.5,
          ceo ? p.desk[1] : -depth / 2 + 0.25,
        ]}
        center
        zIndexRange={[12, 1]}
      >
        <button
          className={`room-badge ${selected ? "active" : ""} ${hover ? "hovered" : ""} ${status !== "idle" ? "busy" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            select(d.id);
          }}
          aria-label={`${d.name}: ${status.replace("_", " ")}`}
        >
          <span>{d.name}</span>
          <small className={status}>
            <i />
            {status.replace("_", " ")}
          </small>
        </button>
      </Html>
    </group>
  );
});
