import type { DepartmentId } from "../../types";
import { officeLayout } from "../../departments/officeLayout";
import { Box, Plant } from "./Furniture";

// Peripheral details only: the established character/laptop rig stays untouched.
export function CozyDetails({ kind }: { kind: DepartmentId }) {
  const p = officeLayout[kind];
  const back = -p.depth / 2;
  const ceo = kind === "ceo";
  return <group>
    {!ceo && <>
      <Box position={[0,0.38,back+0.095]} size={[p.width-0.25,0.48,0.055]} color="#c6b79a" />
      <Box position={[0,0.64,back+0.135]} size={[p.width-0.22,0.045,0.08]} color="#ead7b4" />
      {[-1,1].map(side => <group key={side} position={[side*(p.width/2-0.36),p.wallHeight-0.25,back+0.18]}>
        <Box position={[0,0,0]} size={[0.2,0.39,0.11]} color="#b79c70" />
        <mesh position={[0,0,0.075]}>
          <boxGeometry args={[0.14,0.28,0.05]} />
          <meshStandardMaterial color="#ffedc2" emissive="#e8b777" emissiveIntensity={0.4} />
        </mesh>
      </group>)}
    </>}
    {/* A narrow perimeter band reads as joinery, without covering walking space. */}
    {[-1,1].map(side=><Box key={side} position={[side*(p.width/2-0.17),0.125,0]} size={[0.17,0.015,p.depth-0.25]} color={ceo ? "#bda16c":"#c5ad86"} />)}
    {kind === "engineering" && <group position={[2.2,1.05,-2.9]}>
      <Box position={[0,0.13,0]} size={[0.27,0.27,0.22]} color="#c9d2c7" />
      <Box position={[0,0.39,0]} size={[0.35,0.23,0.27]} color="#c9d2c7" />
      <Box position={[0,0.39,0.145]} size={[0.27,0.12,0.025]} color="#435d64" />
      {[-0.08,0.08].map(x=><Box key={x} position={[x,0.4,0.165]} size={[0.04,0.035,0.015]} color="#dce7ae" />)}
      {[-1,1].map(side=><Box key={side} position={[side*0.21,0.15,0]} size={[0.09,0.23,0.1]} color="#a2b5ae" />)}
    </group>}
    {kind === "content" && <group position={[2.65,0.88,0.6]}>
      <Box position={[0,0,0]} size={[0.32,0.12,0.42]} color="#c06e58" />
      <Box position={[0,0.067,0]} size={[0.27,0.025,0.38]} color="#f0dec3" />
    </group>}
    {kind === "career" && <group position={[-1.9,0.84,0.1]}>
      <Box position={[0,0,0]} size={[0.43,0.04,0.3]} color="#708b80" />
      <Box position={[0,0.025,0]} size={[0.34,0.01,0.23]} color="#f1e4c7" />
    </group>}
    {kind === "project" && <Plant position={[-2.05,1.02,1.35]} />}
    {kind === "knowledge" && <group position={[-1.6,0.86,1.25]}>
      <mesh><cylinderGeometry args={[0.1,0.08,0.17,10]} /><meshStandardMaterial color="#bf876c" /></mesh>
      <mesh position={[0.1,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[0.065,0.02,5,10]} /><meshStandardMaterial color="#bf876c" /></mesh>
    </group>}
    {ceo && <>
      <Box position={[0,0.125,3.8]} size={[10.4,0.018,0.1]} color="#ba9b61" />
      <Box position={[0,0.126,3.55]} size={[10.4,0.018,0.025]} color="#d1b77e" />
    </>}
  </group>;
}
