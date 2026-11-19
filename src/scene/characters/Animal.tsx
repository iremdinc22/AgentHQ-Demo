import type { AnimationTask } from "../agentVisuals";
import { seatedHead } from "../environment/workstationLayout";
import { useSceneResources } from "../resources";
import { useEffect, useRef } from "react";
import { advanceClock, createAnimationClock, createPose, samplePose } from "./animation";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AgentStatus, DepartmentId } from "../../types";
export function Ball({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color,
}: {
  position?: [number, number, number];
  scale?: [number, number, number];
  color: string;
}) {
  const shared = useSceneResources(color);
  return (
    <mesh
      position={position}
      scale={scale}
      geometry={shared.ball}
      material={shared.material}
      dispose={null}
      castShadow
    />
  );
}
function Ear({
  x,
  color,
  long = false,
  floppy = false,
}: {
  x: number;
  color: string;
  long?: boolean;
  floppy?: boolean;
}) {
  return (
    <mesh
      position={[x, long ? 1.63 : 1.38, floppy ? 0.04 : 0]}
      rotation={[0, 0, floppy ? x * 1.8 : 0]}
      castShadow
    >
      {floppy || long ? (
        <capsuleGeometry
          args={[long ? 0.09 : 0.14, long ? 0.55 : 0.25, 3, 5]}
        />
      ) : (
        <coneGeometry args={[0.18, 0.38, 4]} />
      )}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
export function Animal({
  kind,
  status,
  seated = false,
  headTilt = 0,
  pawReach = 0.6,
  pawHeight = 0.61,
  task,
  coordinating = false,
  showEffects = true,
}: {
  kind: DepartmentId;
  status: AgentStatus;
  seated?: boolean;
  headTilt?: number;
  pawReach?: number;
  pawHeight?: number;
  task?: AnimationTask;
  coordinating?: boolean;
  showEffects?: boolean;
}) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<(THREE.Group | null)[]>([]);
  const paws = useRef<(THREE.Group | null)[]>([]);
  const ears = useRef<(THREE.Group | null)[]>([]);
  const tail = useRef<THREE.Group>(null);
  const sleepCue = useRef<THREE.Group>(null);
  const sparkleCue = useRef<THREE.Group>(null);
  const reduced = useRef(false);
  const timeline = useRef(createAnimationClock());
  const pose = useRef(createPose());
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reduced.current = preference.matches; };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useFrame(({ clock, camera }) => {
    const now = clock.elapsedTime;
    advanceClock(timeline.current, status, task, now, status === "working" || status === "waiting_approval" || (task?.department === kind && task.status === "running"));
    const interrupted = status === "error" || task?.status === "cancelled" || task?.status === "error";
    const p = samplePose(pose.current, timeline.current, kind, now, reduced.current, coordinating, interrupted);
    if (body.current) { body.current.position.y = p.bodyY; body.current.rotation.z = p.bodyRoll; }
    if (head.current) head.current.rotation.set(headTilt + p.headPitch, p.headYaw, p.headRoll);
    eyes.current.forEach(eye => { if (eye) eye.scale.y = p.eyeOpen; });
    paws.current.forEach((paw, i) => { if (paw) { paw.position.y = i === 0 ? p.leftPaw : p.rightPaw; paw.position.x = i === 1 ? p.gestureSpread : 0; } });
    ears.current.forEach((ear, i) => { if (ear) ear.rotation.z = p.earTilt * (i === 0 ? 1 : -0.7); });
    if (tail.current) tail.current.rotation.y = p.tailYaw;
    if (sleepCue.current) { sleepCue.current.visible = showEffects && p.sleep; sleepCue.current.position.y = (kind === "engineering" ? 1.5 : 1.9) + p.cueY; sleepCue.current.scale.setScalar(camera instanceof THREE.OrthographicCamera ? Math.min(2.2, Math.max(1, 40 / camera.zoom)) : 1); }
    if (sparkleCue.current) { sparkleCue.current.visible = showEffects && p.sparkle; sparkleCue.current.position.y = 1.9 + p.cueY; }
  });
  const color = {
    ceo: "#d97d41",
    engineering: "#8c9295",
    research: "#96745f",
    content: "#efe3dc",
    career: "#dba351",
    project: "#34434e",
    knowledge: "#9c998b",
    game: "#b75837",
  }[kind];
  const owl = kind === "research",
    penguin = kind === "project",
    mask = kind === "engineering",
    panda = kind === "game";
  return (
    <group ref={body}>
      <Ball
        position={[
          0,
          seated ? (penguin ? 0.59 : 0.51) : 0.57,
          seated ? 0.04 : 0,
        ]}
        scale={[
          owl ? 0.4 : 0.3,
          seated ? (penguin ? 0.38 : 0.3) : penguin ? 0.48 : 0.38,
          0.28,
        ]}
        color={color}
      />
      {(penguin || owl) && (
        <Ball
          position={[0, seated ? 0.55 : 0.58, 0.21]}
          scale={[0.24, seated ? 0.27 : 0.32, 0.09]}
          color="#f5ead6"
        />
      )}
      <group
        ref={head}
        position={seated ? seatedHead : [0, 1.07, 0]}
        rotation={[headTilt, 0, 0]}
      >
        <group position={[0, -1.07, 0]}>
          <Ball
            position={[0, 1.07, 0.02]}
            scale={[owl ? 0.43 : 0.36, 0.32, 0.3]}
            color={color}
          />
          {kind !== "research" && kind !== "project" && (
            <>
              <group ref={node => { if (kind === "content") ears.current[0] = node; }} position={[-0.24,1.36,0]}><group position={[0.24,-1.36,0]}><Ear
                x={-0.24}
                color={color}
                long={kind === "content"}
                floppy={kind === "career"}
              /></group></group>
              <group ref={node => { if (kind === "content") ears.current[1] = node; }} position={[0.24,1.36,0]}><group position={[-0.24,-1.36,0]}><Ear
                x={0.24}
                color={color}
                long={kind === "content"}
                floppy={kind === "career"}
              /></group></group>
            </>
          )}
          {owl && (
            <>
              <Ear x={-0.25} color={color} />
              <Ear x={0.25} color={color} />
            </>
          )}
          {[-1, 1].map((side) => (
            <group key={side}>
              {(owl || panda || mask || penguin) && (
                <Ball
                  position={[side * 0.16, 1.1, 0.274]}
                  scale={[owl ? 0.175 : 0.16, owl ? 0.18 : 0.12, 0.055]}
                  color={mask ? "#343e42" : "#f7e6cf"}
                />
              )}
              <group ref={node => { eyes.current[side === -1 ? 0 : 1] = node; }} position={[side * 0.14, 1.1, 0.32]}>
                <Ball scale={[owl ? 0.083 : 0.042, owl ? 0.095 : 0.05, 0.03]} color="#263d3c" />
                <Ball position={[-0.01,0.018,0.028]} scale={[0.012,0.014,0.006]} color="#fff3db" />
              </group>
            </group>
          ))}
          {owl && [-1,1].map(side => <mesh key={side} position={[side*0.16,1.1,0.342]}>
            <torusGeometry args={[0.115,0.018,5,14]} /><meshStandardMaterial color="#987b50" />
          </mesh>)}
          {owl || penguin ? (
            <mesh position={[0, 0.99, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.085, 0.19, 4]} />
              <meshStandardMaterial color="#e4ad4e" />
            </mesh>
          ) : (
            <>
              <Ball
                position={[0, 0.96, 0.29]}
                scale={[0.19, 0.12, 0.15]}
                color="#f4dfca"
              />
              <Ball
                position={[0, 1.01, 0.42]}
                scale={[0.06, 0.045, 0.04]}
                color="#39413b"
              />
            </>
          )}
          {kind === "knowledge" &&
            [-1, 1].flatMap((s) =>
              [-1, 1].map((v) => (
                <mesh
                  key={`${s}${v}`}
                  position={[s * 0.28, 0.97 + v * 0.04, 0.34]}
                  rotation={[0, 0, v * s * 0.15]}
                >
                  <boxGeometry args={[0.25, 0.012, 0.012]} />
                  <meshStandardMaterial color="#eee5d5" />
                </mesh>
              )),
            )}
        </group>
      </group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Ball
            position={[side * 0.16, seated ? 0.09 : 0.24, seated ? 0.27 : 0.16]}
            scale={[0.13, 0.11, 0.2]}
            color={penguin ? "#e8ad52" : color}
          />
          {seated ? (
            <>
              <Ball
                position={[side * 0.15, 0.27, 0.16]}
                scale={[0.14, 0.15, 0.21]}
                color={color}
              />
              <group ref={node => { paws.current[side === -1 ? 0 : 1] = node; }}>
              <group
                position={[
                  side * 0.25,
                  (0.84 + pawHeight) / 2,
                  (0.1 + pawReach) / 2,
                ]}
                rotation={[Math.atan2(0.1 - pawReach, 0.84 - pawHeight), 0, 0]}
              >
                <Ball
                  scale={[
                    penguin ? 0.105 : 0.085,
                    Math.hypot(pawReach - 0.1, 0.84 - pawHeight) / 2,
                    0.095,
                  ]}
                  color={color}
                />
              </group>
              <Ball
                position={[side * 0.23, pawHeight, pawReach]}
                scale={[0.105, 0.055, 0.11]}
                color={color}
              />
              </group>
            </>
          ) : (
            <group rotation={[0, 0, side * (penguin ? 0.35 : 0.2)]}>
              <Ball
                position={[side * 0.32, 0.62, 0.04]}
                scale={[penguin ? 0.105 : 0.09, 0.26, 0.11]}
                color={color}
              />
            </group>
          )}
        </group>
      ))}
      {kind === "career" && <group ref={tail} position={[0.24,0.43,-0.2]}>
        {[0,1,2].map(i => <Ball key={i} position={[0.08+i*0.055,i*0.07,-i*0.12]} scale={[0.085,0.09,0.13]} color={i === 2 ? "#f4dfca" : color} />)}
      </group>}
      {kind === "content" && (
        <Ball
          position={[0, 0.45, -0.3]}
          scale={[0.14, 0.14, 0.14]}
          color="#fff7ed"
        />
      )}
      {(kind === "ceo" || mask || panda || kind === "knowledge") && (
        <group position={[0.21, 0.4, -0.15]} rotation={[-0.65, 0, -0.55]}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ball
              key={i}
              position={[0, i * 0.13, -i * 0.06]}
              scale={[kind === "knowledge" ? 0.075 : 0.15, 0.13, 0.13]}
              color={
                i === 4 && kind === "ceo"
                  ? "#f4dfca"
                  : (mask || panda) && i % 2 === 0
                    ? "#423f3b"
                    : color
              }
            />
          ))}
        </group>
      )}
      <group ref={sleepCue} position={kind === "engineering" ? [1.5,1.5,1.6] : [-1.5,1.9,0]} visible={false}>
        <Billboard>{[0,1,2].map(i => <group key={i} position={[i*0.2-0.2,i*0.15,0]} scale={1+i*0.14}>
          {[-0.065,0.065].map(y => <mesh key={y} position={[0,y,0]}><boxGeometry args={[0.16,0.027,0.025]} /><meshBasicMaterial color="#41695c" /></mesh>)}
          <mesh rotation={[0,0,-0.85]}><boxGeometry args={[0.025,0.19,0.025]} /><meshBasicMaterial color="#41695c" /></mesh>
        </group>)}</Billboard>
      </group>
      <group ref={sparkleCue} position={[-0.8,1.9,0]} visible={false}>
        <mesh><octahedronGeometry args={[0.12,0]} /><meshBasicMaterial color="#d6b66d" /></mesh>
      </group>
    </group>
  );
}
