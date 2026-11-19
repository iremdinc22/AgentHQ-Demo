import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
// Original signage, drawn locally with a system font; no font or image downloads.
export function FloorLabel({
  text,
  width,
  depth,
}: {
  text: string;
  width: number;
  depth: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "700 80px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#6b614b";
      ctx.fillText(text.toUpperCase(), 512, 64, 980);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      position={[0, 0.18, depth / 2 - 0.24]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[Math.min(width * 0.8, 5.4), 0.62]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
