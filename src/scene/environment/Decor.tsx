import { Box, Plant } from "./Furniture";
export function Rug({
  width,
  depth,
  color,
  pattern = "diamonds",
}: {
  width: number;
  depth: number;
  color: string;
  pattern?: "diamonds" | "stripes" | "grid";
}) {
  return (
    <group>
      <Box position={[0, 0.14, 0]} size={[width, 0.025, depth]} color={color} />
      <Box
        position={[0, 0.157, 0]}
        size={[width - 0.14, 0.008, depth - 0.14]}
        color="#efddba"
      />
      <Box
        position={[0, 0.166, 0]}
        size={[width - 0.26, 0.008, depth - 0.26]}
        color={color}
      />
      {pattern === "diamonds" &&
        [-1, 0, 1].map((i) => (
          <group key={i} position={[i * width * 0.26, 0.175, 0]}>
            <Box
              position={[0, 0, 0]}
              size={[0.52, 0.015, 0.52]}
              rotation={Math.PI / 4}
              color="#edcd8c"
            />
            <Box
              position={[0, 0.01, 0]}
              size={[0.27, 0.012, 0.27]}
              rotation={Math.PI / 4}
              color="#a6b9a0"
            />
          </group>
        ))}
      {pattern === "stripes" &&
        [-2, -1, 0, 1, 2].map((i) => (
          <Box
            key={i}
            position={[i * width * 0.16, 0.175, 0]}
            size={[0.12, 0.012, depth - 0.35]}
            color="#efd9ab"
          />
        ))}
      {pattern === "grid" &&
        [-1, 0, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <Box
              key={`${x}${z}`}
              position={[x * width * 0.26, 0.175, z * depth * 0.2]}
              size={[0.42, 0.01, 0.42]}
              color={z === 1 ? "#d2b882" : "#a0b7ac"}
            />
          )),
        )}
      {[-1, 1].flatMap((z) =>
        Array.from({ length: 9 }, (_, i) => (
          <Box
            key={`${z}${i}`}
            position={[((i - 4) * width) / 10, 0.146, z * (depth / 2 + 0.055)]}
            size={[0.025, 0.015, 0.14]}
            color="#e5cfaa"
          />
        )),
      )}
    </group>
  );
}
export function Tree({
  position,
  scale = 1,
  pot = "#bf8c64",
}: {
  position: [number, number, number];
  scale?: number;
  pot?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.19, 0.48, 8]} />
        <meshStandardMaterial color={pot} />
      </mesh>
      <Box position={[0, 0.88, 0]} size={[0.09, 1.1, 0.09]} color="#8c7954" />
      {[
        [0, 1.45, 0],
        [-0.25, 1.16, 0.08],
        [0.24, 1.28, -0.06],
        [0.08, 1.74, 0.02],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <icosahedronGeometry args={[i === 3 ? 0.34 : 0.42, 0]} />
          <meshStandardMaterial
            color={["#829a57", "#9eaf66", "#72894f", "#a6b66d"][i]}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
export function LoungeChair({ color = "#c1a27a" }: { color?: string }) {
  return (
    <group>
      <Box position={[0, 0.39, 0]} size={[0.83, 0.28, 0.78]} color={color} />
      <Box position={[0, 0.76, -0.32]} size={[0.85, 0.6, 0.19]} color={color} />
      {[-0.4, 0.4].map((x) => (
        <Box
          key={x}
          position={[x, 0.57, 0.02]}
          size={[0.16, 0.3, 0.79]}
          color={color}
        />
      ))}
      {[-0.29, 0.29].flatMap((x) =>
        [-0.23, 0.23].map((z) => (
          <Box
            key={`${x}${z}`}
            position={[x, 0.16, z]}
            size={[0.07, 0.28, 0.07]}
            color="#9b7d56"
          />
        )),
      )}
    </group>
  );
}
export function Sofa({ color = "#c3ac82" }: { color?: string }) {
  return (
    <group>
      <Box position={[0, 0.4, 0]} size={[2.05, 0.32, 0.8]} color={color} />
      <Box
        position={[0, 0.79, -0.35]}
        size={[2.08, 0.65, 0.18]}
        color={color}
      />
      {[-1, 1].map((x) => (
        <Box
          key={x}
          position={[x, 0.64, 0]}
          size={[0.18, 0.38, 0.9]}
          color={color}
        />
      ))}
      {[-0.65,0.65].map(x => <Box key={`cushion${x}`} position={[x,0.83,-0.16]} size={[0.36,0.33,0.16]} color="#d6bc8e" rotation={x*0.15} />)}
      {[-0.53, 0.53].map((x) => (
        <Box
          key={x}
          position={[x, 0.61, 0.04]}
          size={[0.87, 0.13, 0.69]}
          color="#e5d5b3"
        />
      ))}
    </group>
  );
}
export function RoundTable() {
  return (
    <group>
      <mesh position={[0, 0.63, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.64, 0.64, 0.1, 16]} />
        <meshStandardMaterial color="#d4b88a" />
      </mesh>
      <Box position={[0, 0.32, 0]} size={[0.12, 0.6, 0.12]} color="#ad9065" />
      <Box position={[0, 0.06, 0]} size={[0.64, 0.07, 0.64]} color="#ad9065" />
    </group>
  );
}
export function Lamp() {
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.23, 0.26, 0.08, 12]} />
        <meshStandardMaterial color="#a88c60" />
      </mesh>
      <Box position={[0, 0.75, 0]} size={[0.045, 1.4, 0.045]} color="#a88c60" />
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.38, 0.42, 8]} />
        <meshStandardMaterial
          color="#f8e9bf"
          emissive="#d9ac62"
          emissiveIntensity={0.32}
        />
      </mesh>
    </group>
  );
}
export function WallArt({
  x,
  y = 1.4,
  z,
  color = "#e4c88d",
  kind = "print",
}: {
  x: number;
  y?: number;
  z: number;
  color?: string;
  kind?: "print" | "window" | "board";
}) {
  return (
    <group position={[x, y, z]}>
      <Box
        position={[0, 0, 0]}
        size={[
          kind === "board" ? 1.75 : 0.8,
          kind === "board" ? 0.95 : 0.95,
          0.065,
        ]}
        color="#eee2c8"
      />
      <Box
        position={[0, 0, 0.04]}
        size={[
          kind === "board" ? 1.6 : 0.67,
          kind === "board" ? 0.8 : 0.81,
          0.02,
        ]}
        color={kind === "window" ? "#9fb9b6" : color}
      />
      {kind === "window" ? (
        <>
          <Box
            position={[0, 0, 0.06]}
            size={[0.035, 0.83, 0.02]}
            color="#f4ead3"
          />
          <Box
            position={[0, 0, 0.06]}
            size={[0.69, 0.035, 0.02]}
            color="#f4ead3"
          />
          <Box
            position={[0, -0.48, 0.1]}
            size={[0.92, 0.07, 0.26]}
            color="#e7d8bc"
          />
        </>
      ) : kind === "board" ? (
        [-1, 0, 1].flatMap((a) =>
          [-1, 1].map((b) => (
            <Box
              key={`${a}${b}`}
              position={[a * 0.48, b * 0.19, 0.07]}
              size={[0.29, 0.25, 0.018]}
              color={["#e7c58e", "#b6c4a1", "#d9a896"][a + 1]}
            />
          )),
        )
      ) : (
        <>
          <mesh position={[0, 0.08, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
            <meshStandardMaterial color="#f6e7c6" />
          </mesh>
          <Box
            position={[0, -0.2, 0.065]}
            size={[0.42, 0.025, 0.018]}
            color="#f4dfbb"
          />
        </>
      )}
    </group>
  );
}
export function Credenza({ width = 1.6 }: { width?: number }) {
  return (
    <group>
      <Box position={[0, 0.48, 0]} size={[width, 0.78, 0.47]} color="#c1a077" />
      <Box
        position={[0, 0.91, 0]}
        size={[width + 0.08, 0.09, 0.53]}
        color="#e5cba1"
      />
      {[-1, 1].map((i) => (
        <Box
          key={i}
          position={[i * width * 0.24, 0.48, 0.245]}
          size={[width * 0.43, 0.63, 0.025]}
          color="#d6b78b"
        />
      ))}
      <Plant position={[width * 0.26, 0.96, 0]} />
    </group>
  );
}
