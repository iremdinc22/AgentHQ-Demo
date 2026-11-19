import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { BoxGeometry, IcosahedronGeometry, MeshStandardMaterial } from "three";
// One resource set per mounted office. Shared meshes opt out of automatic disposal.
const ResourceContext = createContext<ReturnType<
  typeof createResources
> | null>(null);
function createResources() {
  return {
    box: new BoxGeometry(1, 1, 1),
    ball: new IcosahedronGeometry(1, 1),
    materials: new Map<string, MeshStandardMaterial>(),
  };
}
export function SceneResources({ children }: { children: ReactNode }) {
  const resources = useMemo(createResources, []);
  useEffect(
    () => () => {
      resources.box.dispose();
      resources.ball.dispose();
      resources.materials.forEach((m) => m.dispose());
    },
    [resources],
  );
  return (
    <ResourceContext.Provider value={resources}>
      {children}
    </ResourceContext.Provider>
  );
}
export function useSceneResources(color: string, metallic = false) {
  const resources = useContext(ResourceContext);
  if (!resources) throw new Error("SceneResources is required");
  const key = metallic ? `${color}:aluminium` : color;
  let material = resources.materials.get(key);
  if (!material) {
    material = new MeshStandardMaterial({
      color,
      roughness: metallic ? 0.3 : 0.83,
      metalness: metallic ? 0.55 : 0,
      flatShading: true,
    });
    resources.materials.set(key, material);
  }
  return { box: resources.box, ball: resources.ball, material };
}
