import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { departments } from "../../departments/config";
import { Box } from "./Furniture";
import { Credenza, Lamp, LoungeChair, RoundTable, Sofa, Tree } from "./Decor";

// A fixed presentation sample: these statuses do not execute or authorize tasks.
function OrchestrationBoard() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#263f3d";
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = "#f0d9aa";
      ctx.font = "600 38px sans-serif";
      ctx.fillText("AGENTHQ / MISSION CONTROL", 38, 57);
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#b3c8bc";
      ctx.fillText("SIMULATED STATUS · NO LIVE EXECUTION", 38, 94);
      const statuses = ["COORDINATING", "BUILDING", "REVIEW", "DRAFTING", "READY", "PLANNING", "READY", "IDEATING"];
      departments.forEach((d, i) => {
        const x = 36 + (i % 4) * 242;
        const y = 132 + Math.floor(i / 4) * 174;
        ctx.fillStyle = "#36534e";
        ctx.fillRect(x, y, 224, 150);
        ctx.fillStyle = i === 2 ? "#e9ba73" : "#aac6a4";
        ctx.beginPath(); ctx.arc(x + 24, y + 29, 7, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 23px sans-serif";
        ctx.fillStyle = "#f4ead3";
        ctx.fillText(d.animal.toUpperCase(), x + 16, y + 68, 198);
        ctx.font = "18px sans-serif";
        ctx.fillStyle = "#b6cec0";
        ctx.fillText(statuses[i], x + 16, y + 104);
        ctx.fillStyle = "#637d6d";
        ctx.fillRect(x + 16, y + 123, 190, 5);
        ctx.fillStyle = "#c9ac75";
        ctx.fillRect(x + 16, y + 123, 52 + i * 17, 5);
      });
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#c7b990";
      ctx.fillText("8 AGENTS  /  ONE SHARED PURPOSE", 38, 491);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group position={[2.65, 0.14, -3.65]}>
    <Box position={[0, 1.95, 0]} size={[3.9, 2.05, 0.17]} color="#b49a62" metallic />
    <Box position={[0, 1.95, 0.1]} size={[3.73, 1.87, 0.05]} color="#263f3d" />
    <mesh position={[0, 1.95, 0.131]}>
      <planeGeometry args={[3.62, 1.81]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <Box position={[0, 0.58, 0]} size={[4.12, 0.8, 0.65]} color="#5f6553" />
    <Box position={[0, 1.01, 0]} size={[4.22, 0.08, 0.72]} color="#bba273" />
    {[-1.35, 0, 1.35].map(x => <Box key={x} position={[x, 0.58, 0.34]} size={[1.22, 0.59, 0.025]} color="#73806a" />)}
  </group>;
}
export function ExecutiveDesk() {
  return <group>
    <Box position={[0, 0.75, -0.22]} size={[2.95, 0.16, 1.22]} color="#6c4f3d" />
    <Box position={[0, 0.836, -0.22]} size={[2.86, 0.025, 1.14]} color="#e4d4b5" />
    <Box position={[0, 0.659, -0.22]} size={[2.9, 0.025, 1.18]} color="#b89b62" metallic />
    {[-1.15, 1.15].map(x => <group key={x}>
      <Box position={[x, 0.37, -0.25]} size={[0.45, 0.69, 0.94]} color="#725741" />
      <Box position={[x, 0.055, -0.25]} size={[0.47, 0.06, 0.96]} color="#b89b62" metallic />
      {[0.32, 0.55].map(y => <Box key={y} position={[x, y, 0.23]} size={[0.24, 0.02, 0.025]} color="#c6af79" metallic />)}
    </group>)}
    <Box position={[0, 0.855, -0.1]} size={[1.35, 0.01, 0.85]} color="#718176" />
  </group>;
}
export function ExecutiveOffice() {
  return <>
    <OrchestrationBoard />
    {/* Low perimeter detailing frames the HQ without concealing the fox. */}
    <Box position={[-2.4, 0.47, -4.48]} size={[5.4, 0.65, 0.18]} color="#725b42" />
    {Array.from({length: 12}, (_, i) => <Box key={i} position={[-4.9 + i * 0.44, 0.65, -4.34]} size={[0.055, 0.95, 0.1]} color="#bd9f69" />)}
    <Tree position={[-4.85, 0.14, -3.3]} scale={1.05} pot="#7f8870" />
    <group position={[-3.65, 0.14, -0.2]} rotation={[0, Math.PI / 2, 0]}><Sofa color="#7b8b79" /></group>
    <group position={[-2.45, 0.14, 0.7]}><RoundTable />
      <Box position={[0, 0.71, 0]} size={[0.45, 0.045, 0.33]} color="#6f7969" />
    </group>
    <group position={[-2.1, 0.14, 2.05]} rotation={[0, Math.PI + 0.25, 0]}><LoungeChair color="#d5bd92" /></group>
    <group position={[-4.7, 0.14, 1.35]}><Lamp /></group>
    <group position={[-3.1, 0, 0.6]}>
      <Box position={[0, 0.137, 0]} size={[3.25, 0.02, 3.8]} color="#c9bb99" />
      <Box position={[0, 0.151, 0]} size={[3.05, 0.01, 3.6]} color="#d8ccb0" />
    </group>
    <group position={[4.65, 0.14, -0.5]} rotation={[0, -Math.PI / 2, 0]}><Credenza width={1.6} /></group>
    <group position={[4.5, 0.14, 2.5]}><Lamp /></group>
    <pointLight position={[2.5, 3.2, -2.4]} color="#ffe1aa" intensity={3} distance={7} decay={2} />
  </>;
}
