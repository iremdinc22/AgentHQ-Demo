import { Box } from "./Furniture";
import { laptopHinge, laptopLidAngle, laptopScreen } from "./workstationLayout";
export function Laptop() {
  return (
    <group>
      <Box
        position={[0, 0.866, -0.15]}
        size={[0.94, 0.035, 0.65]}
        color="#d3d8dc"
        metallic
      />
      <Box
        position={[0, 0.885, -0.15]}
        size={[0.88, 0.008, 0.6]}
        color="#e3e7e9"
        metallic
      />
      {[-0.05, -0.125, -0.2].map((z) => (
        <Box
          key={z}
          position={[0, 0.895, z]}
          size={[0.65, 0.009, 0.05]}
          color="#9da7ae"
        />
      ))}
      <Box
        position={[0, 0.893, 0.085]}
        size={[0.3, 0.006, 0.13]}
        color="#b9c2c9"
      />
      <Box
        position={[0, 0.897, 0.085]}
        size={[0.28, 0.004, 0.112]}
        color="#d9dfe3"
        metallic
      />
      <Box
        position={[0, 0.894, -0.424]}
        size={[0.66, 0.025, 0.04]}
        color="#b1bac1"
        metallic
      />
      <group position={laptopHinge} rotation={[laptopLidAngle, 0, 0]}>
        <Box
          position={[0, 0.282, 0]}
          size={[0.94, 0.56, 0.026]}
          color="#d3d8dc"
          metallic
        />
        <Box
          position={[0, 0.285, 0.015]}
          size={[0.87, 0.5, 0.008]}
          color="#73858c"
        />
        <group position={laptopScreen}>
          <Box
            position={[0, 0, 0]}
            size={[0.825, 0.455, 0.005]}
            color="#c1d3d8"
          />
          <Box
            position={[-0.24, 0.15, 0.005]}
            size={[0.25, 0.025, 0.005]}
            color="#f7f6e9"
          />
          <Box
            position={[-0.22, 0.04, 0.005]}
            size={[0.29, 0.12, 0.005]}
            color="#96b4af"
          />
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              position={[0.17, 0.09 - i * 0.08, 0.005]}
              size={[0.27 - i * 0.04, 0.018, 0.005]}
              color="#f3f5eb"
            />
          ))}
        </group>
        <Box
          position={[0, 0.52, 0.021]}
          size={[0.026, 0.012, 0.005]}
          color="#536b72"
        />
        <Box
          position={[0, 0.29, -0.016]}
          size={[0.11, 0.08, 0.007]}
          color="#e9edef"
          metallic
        />
      </group>
    </group>
  );
}
