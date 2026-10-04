'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

// React Three Fiber scene updates are intentionally performed inside useFrame.
/* eslint-disable react-hooks/immutability */

export type BuildingMode = 'EXTERIOR'|'COMPLETE'|'STRUCTURE'|'EXPLODED'|'INTERIOR'|'LANDSCAPE'|'NIGHT';
type SceneProps={mode?:BuildingMode;assembled?:boolean;explorer?:boolean;sunHour?:number;scrollProgress?:number;facadeColor?:string;frameColor?:string;hotspot?:number};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;

function Villa({mode='EXTERIOR',assembled=false,sunHour=11,scrollProgress=0,facadeColor='#c8b9a3',frameColor='#554f47',hotspot=0}:{mode:BuildingMode;assembled:boolean;sunHour:number;scrollProgress:number;facadeColor:string;frameColor:string;hotspot:number}){
  const root=useRef<THREE.Group>(null);const slab=useRef<THREE.Mesh>(null);const upper=useRef<THREE.Mesh>(null);const roof=useRef<THREE.Mesh>(null);const westWall=useRef<THREE.Mesh>(null);const glazing=useRef<THREE.Mesh>(null);const {pointer,camera}=useThree();
  const stages=useMemo(()=>[[5.5,3.2,6.8],[4.4,2.6,5.1],[1.8,1.65,3.6],[4.8,5.5,7.2],[5.1,3.1,6.2]] as [number,number,number][],[]);
  useFrame((state,delta)=>{
    if(!root.current)return;
    const follow=(pointer.x*.1)+(hotspot*.055);
    root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,follow,1.6,delta);
    root.current.rotation.x=THREE.MathUtils.damp(root.current.rotation.x,-pointer.y*.035,1.4,delta);
    if(slab.current)slab.current.position.y=THREE.MathUtils.damp(slab.current.position.y,.1,2.2,delta);
    if(westWall.current)westWall.current.position.y=THREE.MathUtils.damp(westWall.current.position.y,1.05,1.65,delta);
    if(glazing.current)glazing.current.scale.y=THREE.MathUtils.damp(glazing.current.scale.y,mode==='STRUCTURE'?.02:1,2,delta);
    if(upper.current)upper.current.position.y=THREE.MathUtils.damp(upper.current.position.y,mode==='EXPLODED'?2.65:1.38,1.8,delta);
    if(roof.current)roof.current.position.y=THREE.MathUtils.damp(roof.current.position.y,mode==='EXPLODED'?4.15:2.14,1.65,delta);
    if(scrollProgress>0){
      const x=scrollProgress*4;const idx=Math.min(3,Math.floor(x));const t=THREE.MathUtils.smoothstep(x-idx,0,1);const a=stages[idx];const b=stages[idx+1];
      camera.position.x=THREE.MathUtils.damp(camera.position.x,lerp(a[0],b[0],t),1.6,delta);
      camera.position.y=THREE.MathUtils.damp(camera.position.y,lerp(a[1],b[1],t),1.6,delta);
      camera.position.z=THREE.MathUtils.damp(camera.position.z,lerp(a[2],b[2],t),1.6,delta);camera.lookAt(0,.85,0);
    }
    if(state.scene.fog)(state.scene.fog as THREE.Fog).near=THREE.MathUtils.damp((state.scene.fog as THREE.Fog).near,mode==='STRUCTURE'?.25:mode==='NIGHT'?.75:18,1.25,delta);
  });
  const hidden=mode==='STRUCTURE'||mode==='EXPLODED';const night=mode==='NIGHT';const leaf=mode==='LANDSCAPE';const glassColor=night?'#c58d55':'#8fa6a4';
  const wallMat=(color:string)=> <meshStandardMaterial color={color} roughness={.88} transparent={hidden} opacity={hidden?.22:1}/>;
  return <group ref={root} position={[0,-.35,0]}>
    <mesh ref={slab} position={[0,assembled?-.8:.1,0]} castShadow receiveShadow><boxGeometry args={[4.6,.16,2.8]}/><meshStandardMaterial color={facadeColor} roughness={.84}/></mesh>
    <mesh ref={upper} position={[0,assembled?.35:1.38,-.02]} castShadow receiveShadow><boxGeometry args={[3.7,.14,2.35]}/><meshStandardMaterial color="#d7cbbb" roughness={.82}/></mesh>
    <mesh ref={westWall} position={[-.78,assembled?-.8:1.05,-.25]} castShadow><boxGeometry args={[.12,2,2.05]}/>{wallMat('#ded7ca')}</mesh>
    <mesh position={[.78,1.05,-.25]} castShadow><boxGeometry args={[.12,2,2.05]}/>{wallMat('#d4c9b8')}</mesh>
    <mesh position={[0,1.05,-1.05]} castShadow><boxGeometry args={[1.6,2,.1]}/>{wallMat('#d8cfc1')}</mesh>
    <mesh ref={glazing} position={[0,1.02,.91]} scale={[1,assembled?.01:1,1]}><boxGeometry args={[3.12,1.83,.045]}/><meshPhysicalMaterial color={glassColor} roughness={.12} metalness={.08} transmission={.12} transparent opacity={hidden?.04:night?.56:.42} emissive={night?'#a96935':'#000000'} emissiveIntensity={night?.65:0}/></mesh>
    {[-1.36,-.47,.47,1.36].map(x=><mesh key={x} position={[x,1.02,.96]} castShadow><boxGeometry args={[.045,1.98,.08]}/><meshStandardMaterial color={frameColor} metalness={.55} roughness={.34}/></mesh>)}
    {[-1.42,1.42].map(x=><mesh key={x} position={[x,.5,.93]} castShadow><boxGeometry args={[.11,1,.12]}/><meshStandardMaterial color="#bfb3a1" roughness={.82}/></mesh>)}
    <mesh position={[.48,.67,.99]}><boxGeometry args={[.62,.66,.035]}/><meshStandardMaterial color={night?'#f3c98b':'#d1b184'} emissive={night?'#ffb963':'#7e5e39'} emissiveIntensity={night?1.35:.25}/></mesh>
    <mesh ref={roof} position={[0,assembled?.25:2.14,.03]} castShadow><boxGeometry args={[4.25,.12,2.65]}/><meshStandardMaterial color="#bfae98" roughness={.72}/></mesh>
    <mesh position={[0,.04,-.02]} receiveShadow><boxGeometry args={[5.3,.08,3.2]}/><meshStandardMaterial color={night?'#252521':leaf?'#aab39e':'#ddd7cd'} roughness={.9}/></mesh>
    {[-1.65,1.65].map((z,i)=><mesh key={z} position={[i?2.45:-2.4,.04,z]} receiveShadow><boxGeometry args={[1.1,.1,1.1]}/><meshStandardMaterial color={leaf?'#65745b':'#c7c0b4'} roughness={1}/></mesh>)}
    {[[-2.4,.16,-1.65],[2.45,.13,-1.5],[-2.35,.13,1.65],[2.42,.16,1.62]].map((p,i)=><group key={i} position={p as [number,number,number]}><mesh castShadow><cylinderGeometry args={[.16,.23,.32,7]}/><meshStandardMaterial color="#9e9689" roughness={.9}/></mesh><mesh position={[0,.43,0]} castShadow><icosahedronGeometry args={[.43,1]}/><meshStandardMaterial color={leaf?'#435c43':'#64715c'} roughness={1}/></mesh></group>)}
    {Array.from({length:4},(_,i)=><mesh key={`column-${i}`} position={[i<2?-1.45:1.45,.68,i%2?-.75:.82]} castShadow><boxGeometry args={[.09,1.32,.09]}/><meshStandardMaterial color="#c1b5a4" roughness={.8}/></mesh>)}
    {night&&<pointLight position={[.4,1,.6]} intensity={2.3} color="#f0a95f" distance={5}/>}
  </group>;
}

export default function BuildingScene({mode='EXTERIOR',assembled=false,explorer=false,sunHour=11,scrollProgress=0,facadeColor='#c8b9a3',frameColor='#554f47',hotspot=0}:SceneProps){
  const sun=useMemo<[number,number,number]>(()=>{const angle=((sunHour-6)/12)*Math.PI;return [Math.cos(angle)*8,Math.max(1,Math.sin(angle)*8),4]},[sunHour]);
  const bg=mode==='NIGHT'?'#20211f':mode==='LANDSCAPE'?'#dce0d5':'#e8e4dc';
  return <Canvas fallback={<div className="scene-fallback"><span>Architectural model study<br/>Static rendering available.</span></div>} shadows dpr={[1,1.45]} camera={{position:explorer?[5,3.1,6.7]:[5.6,3.2,6.8],fov:37}} gl={{antialias:true,alpha:true}}>
    <color attach="background" args={[bg]}/><fog attach="fog" args={[bg,mode==='STRUCTURE'?.25:18,36]}/>
    <ambientLight intensity={mode==='NIGHT'?.55:1.05}/><directionalLight position={sun} intensity={mode==='NIGHT'?1.1:1.8} castShadow shadow-mapSize={[768,768]}/>
    <Suspense fallback={null}><Environment preset="city"/><Villa mode={mode} assembled={assembled} sunHour={sunHour} scrollProgress={scrollProgress} facadeColor={facadeColor} frameColor={frameColor} hotspot={hotspot}/></Suspense>
    <ContactShadows position={[0,-.33,0]} opacity={.28} blur={2.7} scale={10} far={3}/><gridHelper args={[18,36,'#aaa49b','#d1ccc4']} position={[0,-.34,0]}/>
    <OrbitControls enabled={explorer||scrollProgress===0} enablePan={false} minDistance={5.4} maxDistance={9} minPolarAngle={.83} maxPolarAngle={1.52} target={[0,.8,0]} rotateSpeed={.35}/>
  </Canvas>;
}
