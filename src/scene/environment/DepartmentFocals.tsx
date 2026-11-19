import { Box, Shelf } from "./Furniture";

export function BookWall({ archive = false }: { archive?: boolean }) {
  return <group>
    <Box position={[0, 0.12, 0]} size={[3.45, 0.2, 0.65]} color="#80664e" />
    {[-1.1, 0, 1.1].map((x, column) => <group key={x} position={[x, 0, 0]}>
      {archive ? <>
        <Box position={[0, 1.2, 0]} size={[1.04, 2.15, 0.5]} color="#b6a584" />
        {[0, 1, 2, 3].flatMap(row => [-1, 1].map(side => <group key={`${row}${side}`}>
          <Box position={[side * 0.25, 0.45 + row * 0.49, 0.27]} size={[0.44, 0.41, 0.055]} color={row % 2 ? "#c6bb98" : "#d8ccb0"} />
          <Box position={[side * 0.25, 0.45 + row * 0.49, 0.305]} size={[0.17, 0.055, 0.025]} color="#7a806c" />
        </group>))}
      </> : <group position={[1.7835, 0, 1.377]} scale={[1.45, 1.65, 1.35]}>
        <Shelf color={["#819d97", "#c29c77", "#aab58b"][column]} />
      </group>}
    </group>)}
    <Box position={[0, 2.35, 0]} size={[3.5, 0.12, 0.65]} color="#dfcaa4" />
  </group>;
}
export function ServerRack() {
  return <group>
    <Box position={[0, 1.2, 0]} size={[0.94, 2.35, 0.85]} color="#354347" />
    {Array.from({length: 7}, (_, i) => <group key={i}>
      <Box position={[0, 0.28 + i * 0.29, 0.44]} size={[0.8, 0.22, 0.035]} color="#506269" />
      <Box position={[-0.15, 0.28 + i * 0.29, 0.465]} size={[0.39, 0.055, 0.01]} color="#27393e" />
      <Box position={[0.29, 0.28 + i * 0.29, 0.465]} size={[0.055, 0.055, 0.012]} color="#a2c69e" />
    </group>)}
  </group>;
}
export function ElectronicsBench() {
  return <group>
    <Box position={[0, 0.85, 0]} size={[2.4, 0.12, 0.85]} color="#cdbb95" />
    {[-1, 1].map(x => <Box key={x} position={[x, 0.43, 0]} size={[0.12, 0.8, 0.7]} color="#657a78" />)}
    <Box position={[-0.62, 1.25, -0.18]} size={[0.85, 0.57, 0.28]} color="#667b78" />
    <Box position={[-0.65, 1.28, -0.025]} size={[0.51, 0.36, 0.025]} color="#243e42" />
    {[-0.12, 0, 0.12].map((y,i) => <Box key={y} position={[-0.65, 1.28+y, -0.006]} size={[0.36-i*0.06, 0.018, 0.008]} color="#adc8a4" />)}
    <Box position={[0.48, 0.94, 0.06]} size={[0.74, 0.06, 0.47]} color="#528475" />
    {[-0.2, 0.1, 0.35].map(x => <Box key={x} position={[x+0.35, 1, 0.06]} size={[0.12, 0.08, 0.18]} color="#d7bd84" />)}
  </group>;
}
export function Tripod({ light = false }: { light?: boolean }) {
  return <group>
    <Box position={[0, 0.9, 0]} size={[0.065, 1.7, 0.065]} color="#596368" />
    {[0, 2.094, 4.189].map(yaw => <group key={yaw} rotation={[0,yaw,0]}>
      <group position={[0,0.32,0.21]} rotation={[-0.6,0,0]}><Box position={[0,0,0]} size={[0.045,0.75,0.045]} color="#596368" /></group>
    </group>)}
    {light ? <>
      <Box position={[0, 1.86, 0]} size={[0.85, 0.7, 0.16]} color="#566267" />
      <Box position={[0, 1.86, 0.095]} size={[0.73, 0.58, 0.035]} color="#fff0cb" />
    </> : <>
      <Box position={[0, 1.65, 0]} size={[0.5, 0.36, 0.34]} color="#48575d" />
      <mesh position={[0,1.65,0.27]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[0.15,0.15,0.28,12]} /><meshStandardMaterial color="#263c43" /></mesh>
      <Box position={[0, 1.9, 0]} size={[0.23, 0.1, 0.17]} color="#8a9c9d" />
    </>}
  </group>;
}
export function Moodboard() {
  return <group>
    <Box position={[0,1.45,0]} size={[3.4,1.9,0.12]} color="#a68d6b" />
    <Box position={[0,1.45,0.07]} size={[3.22,1.72,0.025]} color="#c4aa88" />
    {[-1.05,0,1.05].flatMap((x,i) => [-1,1].map((row,j) => <group key={`${x}${row}`}>
      <Box position={[x,1.45+row*0.43,0.1]} size={[0.85,j ? 0.58:0.7,0.018]} color={["#e4d3b6","#91aaa0","#c18370","#d8b66d"][(i+j)%4]} />
      <Box position={[x-0.14,1.45+row*0.43,0.12]} size={[0.27,0.25,0.01]} color="#f3e7cd" rotation={0.2} />
    </group>))}
  </group>;
}
export function PlanningWall() {
  return <group>
    <Box position={[0,1.48,0]} size={[4.35,2,0.13]} color="#d8c8ab" />
    <Box position={[0,1.48,0.08]} size={[4.18,1.83,0.025]} color="#f0ebda" />
    {[-1.35,0,1.35].map((x,i) => <group key={x}>
      <Box position={[x,2.16,0.11]} size={[1.12,0.15,0.02]} color={["#a6b7b4","#d1b478","#9db493"][i]} />
      {[0,1,2].slice(0,3-i%2).map(row => <Box key={row} position={[x,1.82-row*0.32,0.11]} size={[0.84,0.22,0.02]} color={["#c8d9d3","#e6d29f","#b9cda9"][i]} />)}
    </group>)}
    <Box position={[0,0.28,0]} size={[4.35,0.42,0.12]} color="#435e64" />
    {[-1.1,-0.25,0.7].map((x,i) => <Box key={x} position={[x,0.35-i*0.08,0.08]} size={[1.2,0.045,0.025]} color="#d6c18b" />)}
  </group>;
}
export function Arcade() {
  return <group>
    <Box position={[0,0.58,0]} size={[1,1.08,0.85]} color="#6c5b7d" />
    <Box position={[0,1.55,-0.18]} size={[1,1.05,0.46]} color="#9b80a7" />
    <Box position={[0,1.55,0.07]} size={[0.78,0.65,0.025]} color="#293d51" />
    {[-1,0,1].flatMap(x=>[0,1].map(y=><Box key={`${x}${y}`} position={[x*0.18,1.45+y*0.18,0.09]} size={[0.12,0.12,0.01]} color={y ? "#e6bf70":"#99c9bd"} />))}
    <Box position={[0,2.06,-0.14]} size={[1.05,0.2,0.52]} color="#dbb67f" />
    <Box position={[0,1.01,0.25]} size={[1,0.13,0.53]} color="#bd9bb0" />
    <Box position={[-0.22,1.16,0.28]} size={[0.055,0.25,0.055]} color="#47555b" />
    {[-0.1,0.12,0.3].map(x=><Box key={x} position={[x,1.1,0.32]} size={[0.1,0.04,0.1]} color="#e5c583" />)}
  </group>;
}
