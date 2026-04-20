import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BUTTON_DATA = {
  DPAD_UP: { label: 'D-Up', action: 'JUMP', color: '#e81c1c', active: true },
  DPAD_LEFT: { label: 'D-Left', action: 'MOVE LEFT', color: '#e81c1c', active: true },
  DPAD_RIGHT: { label: 'D-Right', action: 'MOVE RIGHT', color: '#e81c1c', active: true },
  DPAD_DOWN: { label: 'D-Down', action: null, color: '#333333', active: false },
  A: { label: 'A', action: 'SHOOT', color: '#cc0000', active: true },
  B: { label: 'B', action: 'INTERACT', color: '#0044cc', active: true },
  X: { label: 'X', action: 'OPTION A', color: '#cc9900', active: true },
  Y: { label: 'Y', action: 'OPTION B', color: '#00aa44', active: true },
  L: { label: 'L shoulder', action: null, color: '#222222', active: false },
  R: { label: 'R shoulder', action: null, color: '#222222', active: false },
};

function Button({ position, args, shape = 'box', type, onAction, onHover }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const data = BUTTON_DATA[type];

  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = hovered && data.active ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (data.active) {
      setHovered(true);
      onHover(data);
      document.body.style.cursor = 'crosshair';
    }
  };

  const handlePointerOut = (e) => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'none';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (data.active && data.action) {
      onAction(data.action);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {shape === 'box' ? (
        <boxGeometry args={args} />
      ) : (
        <cylinderGeometry args={args} />
      )}
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={hovered && data.active ? 2 : 0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function ControllerModel({ onAction, onHover }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    // Rotation stopped as requested to make interactions easier
    // if (groupRef.current) {
    //   groupRef.current.rotation.y += 0.003;
    // }
  });

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 1.5, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* D-Pad Container (Cross shape) */}
      <group position={[-0.8, 0, 0.21]}>
         {/* UP */}
         <Button type="DPAD_UP" position={[0, 0.25, 0]} args={[0.2, 0.2, 0.1]} onAction={onAction} onHover={onHover} />
         {/* DOWN */}
         <Button type="DPAD_DOWN" position={[0, -0.25, 0]} args={[0.2, 0.2, 0.1]} onAction={onAction} onHover={onHover} />
         {/* LEFT */}
         <Button type="DPAD_LEFT" position={[-0.25, 0, 0]} args={[0.2, 0.2, 0.1]} onAction={onAction} onHover={onHover} />
         {/* RIGHT */}
         <Button type="DPAD_RIGHT" position={[0.25, 0, 0]} args={[0.2, 0.2, 0.1]} onAction={onAction} onHover={onHover} />
      </group>

      {/* Action Buttons */}
      <group position={[0.8, 0, 0.21]}>
        {/* Y (Top) */}
        <Button type="Y" position={[0, 0.3, 0]} args={[0.12, 0.12, 0.1, 32]} shape="cylinder" onAction={onAction} onHover={onHover} />
        {/* A (Bottom) */}
        <Button type="A" position={[0, -0.3, 0]} args={[0.12, 0.12, 0.1, 32]} shape="cylinder" onAction={onAction} onHover={onHover} />
        {/* X (Left) */}
        <Button type="X" position={[-0.3, 0, 0]} args={[0.12, 0.12, 0.1, 32]} shape="cylinder" onAction={onAction} onHover={onHover} />
        {/* B (Right) */}
        <Button type="B" position={[0.3, 0, 0]} args={[0.12, 0.12, 0.1, 32]} shape="cylinder" onAction={onAction} onHover={onHover} />
      </group>

      {/* Shoulder Buttons */}
      <Button type="L" position={[-1, 0.75, 0]} args={[0.8, 0.1, 0.3]} onAction={onAction} onHover={onHover} />
      <Button type="R" position={[1, 0.75, 0]} args={[0.8, 0.1, 0.3]} onAction={onAction} onHover={onHover} />

      {/* Arduino Board (Decorative) */}
      <group position={[0, 0, -0.25]}>
         {/* PCB */}
         <mesh>
            <boxGeometry args={[1, 0.8, 0.05]} />
            <meshStandardMaterial color="#005500" />
         </mesh>
         {/* Pins */}
         {[...Array(6)].map((_, i) => (
           <mesh key={i} position={[-0.3 + i * 0.12, 0.3, 0.05]}>
              <cylinderGeometry args={[0.01, 0.01, 0.1]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
           </mesh>
         ))}
      </group>
    </group>
  );
}
