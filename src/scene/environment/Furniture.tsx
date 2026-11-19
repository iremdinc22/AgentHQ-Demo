import { chairSeat, chairBack, deskTop } from "./workstationLayout";
import { useSceneResources } from "../resources";
export function Box({
  position,
  size,
  color,
  rotation = 0,
  metallic = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: number;
  metallic?: boolean;
}) {
  const shared = useSceneResources(color, metallic);
  return (
    <mesh
      geometry={shared.box}
      material={shared.material}
      scale={size}
      dispose={null}
      position={position}
      rotation={[0, rotation, 0]}
      castShadow
      receiveShadow
    ></mesh>
  );
}
export function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.14, 0.32, 7]} />
        <meshStandardMaterial color="#d9a68b" />
      </mesh>
      {[-1, 0, 1].map((n) => (
        <mesh
          key={n}
          position={[n * 0.1, 0.5 + Math.abs(n) * 0.06, 0]}
          rotation={[0, 0, n * 0.45]}
          castShadow
        >
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={n ? "#7a9c74" : "#9bb082"} />
        </mesh>
      ))}
    </group>
  );
}
export function Desk() {
  return (
    <group>
      <Box position={deskTop.center} size={deskTop.size} color="#eee2c8" />
      <Box position={[0, 0.71, -0.22]} size={[2.08, 0.025, 1.04]} color="#aa9170" />
      {[-0.9, 0.9].map((x) => (
        <Box
          key={x}
          position={[x, 0.4, -0.22]}
          size={[0.075, 0.76, 0.86]}
          color="#bba98b"
        />
      ))}
      <Box
        position={[0, 0.67, -0.7]}
        size={[1.86, 0.11, 0.055]}
        color="#d7c6a7"
      />
    </group>
  );
}
export function Chair() {
  return (
    <group>
      <Box position={chairSeat} size={[0.7, 0.12, 0.72]} color="#aa9877" />
      <Box position={chairBack} size={[0.72, 0.42, 0.1]} color="#aa9877" />
      <Box position={[0, 0.67, 0.375]} size={[0.6, 0.3, 0.035]} color="#c8b58f" />
      <Box position={[0, 0.2, 0]} size={[0.085, 0.4, 0.085]} color="#a3a6a1" />
      <Box position={[0, 0.045, 0]} size={[0.57, 0.05, 0.08]} color="#a3a6a1" />
      <Box position={[0, 0.045, 0]} size={[0.08, 0.05, 0.57]} color="#a3a6a1" />
    </group>
  );
}
export function Shelf({ color = "#b9c5a4" }: { color?: string }) {
  return (
    <group position={[-1.23, 0, -1.02]}>
      <Box position={[0, 0.7, 0]} size={[0.62, 1.35, 0.29]} color="#92785c" />
      {[-0.32, 0.32].map(x => <Box key={x} position={[x, 0.7, 0.035]} size={[0.055, 1.4, 0.39]} color="#dbc39c" />)}
      <Box position={[0, 1.4, 0.035]} size={[0.72, 0.055, 0.39]} color="#e4cfaa" />
      {[0.3, 0.7, 1.1].map((y, j) => (
        <group key={y}>
          <Box
            position={[0, y - 0.15, 0.06]}
            size={[0.65, 0.045, 0.36]}
            color="#e5c9a5"
          />
          {[-0.2, -0.06, 0.08, 0.21].map((x, i) => (
            <Box
              key={x}
              position={[x, y, 0.07]}
              size={[0.09, 0.24 + (i % 2) * 0.07, 0.21]}
              color={[color, "#d4a996", "#e9d7ac", "#a6bcb8"][(i + j) % 4]}
            />
          ))}
        </group>
      ))}
    </group>
  );
}
export function Board({ kind }: { kind: string }) {
  return (
    <group position={[0.7, 1.1, -1.2]}>
      <Box position={[0, 0, 0]} size={[1.02, 0.7, 0.08]} color="#b19678" />
      <Box
        position={[0, 0, 0.05]}
        size={[0.92, 0.6, 0.02]}
        color={kind === "game" ? "#697b74" : "#ede4d2"}
      />
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          position={[
            -0.29 + (i % 3) * 0.29,
            0.14 - Math.floor(i / 3) * 0.25,
            0.07,
          ]}
          size={[0.17, 0.16, 0.015]}
          color={["#e8b0aa", "#b2c9b4", "#dbc38c"][i % 3]}
        />
      ))}
    </group>
  );
}
