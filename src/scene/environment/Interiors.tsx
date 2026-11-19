import type { DepartmentId } from "../../types";
import { ExecutiveOffice } from "./ExecutiveOffice";
import { Box } from "./Furniture";
import { Credenza, Lamp, LoungeChair, RoundTable, Sofa, Tree, WallArt } from "./Decor";
import { Arcade, BookWall, ElectronicsBench, Moodboard, PlanningWall, ServerRack, Tripod } from "./DepartmentFocals";

export function Interiors({ kind }: { kind: DepartmentId }) {
  if (kind === "ceo") return <ExecutiveOffice />;
  return <>
    {kind === "engineering" && <>
      <group position={[-2.35,0.14,-2.65]}><ServerRack /></group>
      <group position={[-1.24,0.14,-2.65]}><ServerRack /></group>
      <group position={[1.45,0.14,-2.95]}><ElectronicsBench /></group>
      {[0.6,1.8].map(x => <group key={x} position={[x,1.75,-3.55]}>
        <Box position={[0,0,0]} size={[1.05,0.7,0.09]} color="#697e7c" />
        <Box position={[0,0,0.055]} size={[0.94,0.59,0.025]} color="#263f43" />
        {[0,1,2,3].map(i => <Box key={i} position={[-0.08,0.19-i*0.12,0.075]} size={[0.59-i%2*0.16,0.025,0.01]} color="#a8c9bb" />)}
      </group>)}
      <Tree position={[2.45,0.14,2.6]} scale={0.7} />
    </>}
    {kind === "research" && <>
      <group position={[-1.65,0.14,-2.48]}><BookWall /></group>
      <group position={[2.6,0.14,-1.25]}>
        <Box position={[0,0.45,0]} size={[0.6,0.8,0.6]} color="#bba580" />
        <mesh position={[0,1.23,0]} castShadow><icosahedronGeometry args={[0.5,1]} /><meshStandardMaterial color="#8ca99c" flatShading /></mesh>
        <mesh position={[0,1.23,0]} rotation={[0,0,0.35]}><torusGeometry args={[0.57,0.035,5,24]} /><meshStandardMaterial color="#baa072" /></mesh>
      </group>
      <group position={[2.7,0.14,1.2]} rotation={[0,-0.4,0]}><LoungeChair color="#b6bf94" /></group>
      <group position={[-3.2,0.14,1.35]}><RoundTable />
        {[-0.2,0,0.2].map((x,i)=><Box key={x} position={[x,0.73+i*0.035,0]} size={[0.48,0.035,0.34]} color={i%2 ? "#9aac93":"#ede1c2"} />)}
      </group>
    </>}
    {kind === "content" && <>
      <group position={[0.9,0.14,-2.9]}><Moodboard /></group>
      <group position={[-2.85,0.14,0.7]} rotation={[0,0.8,0]}><Tripod /></group>
      <group position={[-2.8,0.14,-1.8]} rotation={[0,0.55,0]}><Tripod light /></group>
      <group position={[2.75,0.14,0.4]} rotation={[0,-Math.PI/2,0]}><Sofa color="#caa78e" /></group>
    </>}
    {kind === "career" && <>
      <group position={[-2.5,0.14,0.9]} rotation={[0,0.8,0]}><LoungeChair color="#b9aa87" /></group>
      <group position={[-1.15,0.14,-0.7]} rotation={[0,Math.PI+0.6,0]}><LoungeChair color="#b9aa87" /></group>
      <group position={[-1.9,0.14,0.1]}><RoundTable /></group>
      <group position={[1.65,0.14,-2.5]}><Credenza width={2.5} /></group>
      {[-0.1,1.2,2.5].map((x,i)=><WallArt key={x} x={x} y={1.6} z={-2.9} kind="print" color={["#c9bb92","#a1b3a1","#b6a581"][i]} />)}
      <Tree position={[-3.1,0.14,-2.4]} scale={0.8} />
    </>}
    {kind === "project" && <>
      <group position={[0.25,0.14,-3.62]}><PlanningWall /></group>
      <group position={[-2.05,0.14,0.7]}>
        <Box position={[0,0.8,0]} size={[0.85,0.12,2.1]} color="#d1c2a4" />
        {[-0.8,0.8].map(z=><Box key={z} position={[0,0.4,z]} size={[0.55,0.75,0.09]} color="#82969a" />)}
        <Box position={[0,0.875,0]} size={[0.62,0.02,1.5]} color="#e9e4cf" />
        {[-0.45,0,0.45].map(z=><Box key={z} position={[0,0.89,z]} size={[0.4,0.01,0.04]} color="#8faeaa" />)}
      </group>
      <group position={[2.3,0.14,1.65]}><LoungeChair color="#9db4b9" /></group>
    </>}
    {kind === "knowledge" && <>
      <group position={[-2.45,0.14,-2.48]}><BookWall archive /></group>
      <group position={[2.4,0.14,-2.48]} scale={[0.85,0.65,1]}><BookWall /></group>
      <group position={[-3.1,0.14,0.7]} rotation={[0,0.4,0]}><LoungeChair color="#b2aa75" /></group>
      <group position={[-1.9,0.14,1.25]}><RoundTable />
        <Box position={[-0.15,0.71,0]} size={[0.3,0.035,0.4]} color="#f2e5c7" rotation={-0.12} />
        <Box position={[0.15,0.71,0]} size={[0.3,0.035,0.4]} color="#e7d8b5" rotation={0.12} />
      </group>
      <group position={[-4.1,0.14,0.4]}><Lamp /></group>
    </>}
    {kind === "game" && <>
      <group position={[-3.3,0.14,-2.25]}><Arcade /></group>
      <group position={[-2.1,0.14,-2.25]} rotation={[0,-0.12,0]}><Arcade /></group>
      <group position={[3.15,0.14,0.6]} rotation={[0,-Math.PI/2,0]}><Sofa color="#af95b1" /></group>
      <group position={[1.85,0.14,0.8]}><RoundTable />
        {[-0.24,0.24].map(x=><group key={x} position={[x,0.75,0]}>
          <Box position={[0,0,0]} size={[0.35,0.1,0.2]} color="#4e626b" />
          <Box position={[-0.09,0.06,0]} size={[0.04,0.02,0.12]} color="#d5bc8b" />
          <Box position={[0.09,0.06,0]} size={[0.055,0.02,0.055]} color="#d5bc8b" />
        </group>)}
      </group>
      <group position={[1.2,1.12,-2.88]}>
        <Box position={[0,0,0]} size={[2.6,1.1,0.1]} color="#3b485e" />
        {[-2,-1,0,1,2].flatMap(x=>[0,1,2].filter(y=>(x+y)%2===0).map(y=><Box key={`${x}${y}`} position={[x*0.35,-0.3+y*0.3,0.065]} size={[0.25,0.25,0.02]} color={y===1 ? "#e0be7b":"#a8b9c0"} />))}
      </group>
    </>}
  </>;
}
