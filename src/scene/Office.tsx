import { Component, memo, useRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { departments } from "../departments/config";
import { Workspace } from "./environment/Workspace";
import { Box } from "./environment/Furniture";
import { SceneResources } from "./resources";
import { Commons } from "./environment/Commons";
import { officeBounds } from "../departments/officeLayout";
import { CameraRig } from "./camera/CameraRig";
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        The 3D office needs WebGL. You can still select departments and use the
        simulation below.
      </div>
    ) : (
      this.props.children
    );
  }
}
export const Office = memo(function Office({
  shadows = true,
}: {
  shadows?: boolean;
}) {
  const portal = useRef<HTMLDivElement>(null!);
  return (
    <SceneBoundary>
      <div ref={portal} style={{ height: "100%", position: "relative" }}>
        <Canvas
          orthographic
          camera={{ position: [19, 23, 28], zoom: 35, near: 0.1, far: 100 }}
          shadows={shadows ? "soft" : false}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "low-power" }}
          fallback={
            <div className="scene-fallback">
              WebGL is unavailable. Department controls remain available.
            </div>
          }
        >
          <SceneResources>
            <ambientLight intensity={0.49} color="#ffedda" />
            <hemisphereLight args={["#fff1d9", "#8f9f91", 0.9]} />
            <directionalLight
              position={[-10, 18, 10]}
              intensity={2.55}
              castShadow={shadows}
              shadow-mapSize={[1536, 1536]}
              shadow-camera-left={-22}
              shadow-camera-right={22}
              shadow-camera-top={22}
              shadow-camera-bottom={-22}
              shadow-bias={-0.0003}
              shadow-normalBias={0.025}
              shadow-radius={4}
            />
            <Box
              position={[0, -0.32, 0]}
              size={[officeBounds.width, 0.55, officeBounds.depth]}
              color="#c4aa7d"
            />
            <Box
              position={[0, -0.04, 0]}
              size={[officeBounds.width - 0.12, 0.1, officeBounds.depth - 0.12]}
              color="#efdfbf"
            />
            <Commons />
            {departments.map((d) => (
              <Workspace key={d.id} department={d} portal={portal} />
            ))}

            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.61, 0]}
              receiveShadow
            >
              <planeGeometry args={[200, 200]} />
              <shadowMaterial opacity={0.24} />
            </mesh>
            <CameraRig />
          </SceneResources>
        </Canvas>
      </div>
    </SceneBoundary>
  );
});
