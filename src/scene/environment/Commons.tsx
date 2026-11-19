import { officeBounds, officeLayout } from "../../departments/officeLayout";
import { Box } from "./Furniture";
import { Tree } from "./Decor";
export function Commons() {
  const backLane =
    (officeLayout.ceo.position[2] -
      officeLayout.ceo.depth / 2 +
      officeLayout.content.position[2] +
      officeLayout.content.depth / 2) /
    2;
  const frontLane =
    (officeLayout.ceo.depth / 2 +
      officeLayout.knowledge.position[2] -
      officeLayout.knowledge.depth / 2) /
    2;
  return (
    <group>
      <Box
        position={[0, -0.02, 0]}
        size={[officeBounds.width - 0.8, 0.1, officeBounds.depth - 0.6]}
        color="#e7d7b8"
      />
      {[backLane, frontLane].map((z) => (
        <Box
          key={z}
          position={[0, 0.045, z]}
          size={[26, 0.025, 0.5]}
          color="#d4bf98"
        />
      ))}
      {[backLane, frontLane].flatMap(z => [-1, 1].map(s =>
        <Box key={`${z}${s}`} position={[0, 0.065, z + s * 0.2]} size={[25.5, 0.012, 0.025]} color="#b6a17e" />
      ))}
      <Box
        position={[-0.25, 0.05, 8.2]}
        size={[1.02, 0.025, 6.1]}
        color="#c9b18b"
      />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Tree
            position={[s * 12, 0.07, 10.4]}
            scale={1.1}
            pot={s < 0 ? "#ba8c61" : "#c89664"}
          />
          <Box
            position={[s * 12, 0.24, 9.4]}
            size={[0.62, 0.42, 1.5]}
            color="#c1ad83"
          />
        </group>
      ))}
      <Box
        position={[-0.25, 0.22, 11.4]}
        size={[1.5, 0.35, 0.26]}
        color="#b69a70"
      />
      {[-0.38, 0, 0.38].map((x) => (
        <Box
          key={x}
          position={[x - 0.25, 0.23, 11.54]}
          size={[0.18, 0.12, 0.012]}
          color="#f4dfb1"
        />
      ))}
    </group>
  );
}
