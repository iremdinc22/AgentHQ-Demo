import type { AnimationTask } from "../agentVisuals";
import type { AgentStatus, DepartmentId } from "../../types";
import { Animal } from "../characters/Animal";
import { Box, Chair, Desk } from "./Furniture";
import { ExecutiveDesk } from "./ExecutiveOffice";
import { Laptop } from "./Laptop";
import {
  animalYaw,
  laptopHeadPitch,
  pawHeight,
  pawReach,
  seatedAnimal,
} from "./workstationLayout";
// The whole composition turns together in Workspace, rather than independently
// turning the animal toward the viewer or chasing a screen with ref mutations.
export function Workstation({
  kind,
  status,
  task,
  coordinating = false,
}: {
  kind: DepartmentId;
  status: AgentStatus;
  task?: AnimationTask;
  coordinating?: boolean;
}) {
  return (
    <group>
      {kind === "ceo" ? <ExecutiveDesk /> : <Desk />}
      <Laptop />
      <group position={[seatedAnimal[0], 0, seatedAnimal[2]]}>
        <Chair />
      </group>
      <group position={seatedAnimal} rotation={[0, animalYaw, 0]}>
        <Animal
          kind={kind}
          status={status}
          seated
          task={task}
          coordinating={coordinating}
          headTilt={laptopHeadPitch()}
          pawReach={pawReach}
          pawHeight={pawHeight}
        />
      </group>
      <Box
        position={[0.79, 0.86, -0.28]}
        size={[0.22, 0.025, 0.27]}
        color="#e5c58a"
      />
      <mesh position={[-0.79, 0.93, -0.34]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.17, 8]} />
        <meshStandardMaterial color="#f4e4bf" />
      </mesh>
    </group>
  );
}
