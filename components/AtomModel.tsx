/// <reference types="@react-three/fiber" />
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Proton: React.FC = () => (
  <mesh>
    <sphereGeometry args={[0.2, 16, 16]} />
    <meshStandardMaterial color="#ff6961" roughness={0.5} />
  </mesh>
);

const Neutron: React.FC = () => (
  <mesh>
    <sphereGeometry args={[0.2, 16, 16]} />
    <meshStandardMaterial color="#aec6cf" roughness={0.5} />
  </mesh>
);

const Electron: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.1, 16, 16]} />
    <meshStandardMaterial color="#77ddff" emissive="#77ddff" emissiveIntensity={2} />
  </mesh>
);

const Nucleus: React.FC<{ protons: number; neutrons: number }> = ({ protons, neutrons }) => {
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < protons; i++) arr.push({ type: 'proton', pos: new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5) });
    for (let i = 0; i < neutrons; i++) arr.push({ type: 'neutron', pos: new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5) });
    return arr;
  }, [protons, neutrons]);

  return (
    <group>
      {particles.map((p, i) => (
        <group key={i} position={p.pos}>
          {p.type === 'proton' ? <Proton /> : <Neutron />}
        </group>
      ))}
    </group>
  );
};

const ElectronShell: React.FC<{ radius: number; electronCount: number; speed: number }> = ({ radius, electronCount, speed }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.2;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.1;
    }
  });

  const electrons = useMemo(() => {
    const arr = [];
    for (let i = 0; i < electronCount; i++) {
      const angle = (i / electronCount) * Math.PI * 2;
      arr.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return arr;
  }, [electronCount, radius]);

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
         <torusGeometry args={[radius, 0.02, 16, 100]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      {electrons.map((pos, i) => (
         <Electron key={i} position={[pos[0], pos[1], pos[2]]} />
      ))}
    </group>
  );
};

// This component dynamically adjusts the camera to frame the atom perfectly.
const CameraController: React.FC<{ maxRadius: number }> = ({ maxRadius }) => {
  const { camera, size, controls } = useThree();

  useEffect(() => {
    // FIX: Add a type guard to ensure the camera is a PerspectiveCamera before accessing fov.
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return;

    // Use diameter with padding to ensure the atom doesn't touch the screen edges
    const objectDiameter = maxRadius * 2.4; 

    const fov = THREE.MathUtils.degToRad(camera.fov);
    const aspect = size.width / size.height;

    // Calculate the distance required to fit the atom based on viewport height
    const distanceV = (objectDiameter / 2) / Math.tan(fov / 2);
    
    // Calculate the horizontal FOV and the distance required to fit based on viewport width
    const hFov = 2 * Math.atan(Math.tan(fov / 2) * aspect);
    const distanceH = (objectDiameter / 2) / Math.tan(hFov / 2);

    // The final distance is the larger of the two, ensuring the atom fits on both axes
    const distance = Math.max(distanceV, distanceH);

    // Set a slight top-down angle for a better view
    const yOffset = distance * 0.1;
    
    camera.position.set(0, yOffset, distance);
    camera.lookAt(0, 0, 0);
    
    // Explicitly update controls after manual camera manipulation
    (controls as any).update();
    (controls as any).minDistance = distance * 0.5;
    (controls as any).maxDistance = distance * 2;

  }, [camera, size, maxRadius, controls]);

  return null;
};

interface AtomModelProps {
  protons: number;
  neutrons: number;
  electronsPerShell: number[];
}

const AtomModel: React.FC<AtomModelProps> = ({ protons, neutrons, electronsPerShell }) => {
  const maxRadius = electronsPerShell.length > 0
    ? 2 + (electronsPerShell.length - 1) * 1.5
    : 2;
  
  return (
    <Canvas camera={{ fov: 50, near: 0.1, far: 1000 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Nucleus protons={protons} neutrons={ neutrons} />
      
      {electronsPerShell.map((count, i) => (
        <ElectronShell 
          key={i} 
          radius={2 + i * 1.5} 
          electronCount={count}
          speed={0.5 / (i + 1)}
        />
      ))}

      <CameraController maxRadius={maxRadius} />

      <OrbitControls 
        makeDefault
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
};

export default AtomModel;
