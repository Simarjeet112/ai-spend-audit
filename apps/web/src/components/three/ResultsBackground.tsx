"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SavingsOrb({ saving }: { saving: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const scale = Math.min(1 + saving / 200, 4);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.05;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    mesh.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
  });

  return (
    <mesh ref={mesh} position={[4, 0, -6]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#2563eb"
        emissive="#1d4ed8"
        emissiveIntensity={0.6}
        transparent
        opacity={0.12}
        wireframe
      />
    </mesh>
  );
}

function DataRings() {
  const rings = [
    { radius: 3, speed: 0.08, tilt: 0.4, color: "#3b82f6", opacity: 0.15 },
    { radius: 4.5, speed: -0.05, tilt: 0.8, color: "#2563eb", opacity: 0.1 },
    { radius: 6, speed: 0.03, tilt: 1.2, color: "#60a5fa", opacity: 0.08 },
  ];

  return (
    <>
      {rings.map((ring, i) => {
        const mesh = useRef<THREE.Mesh>(null);
        useFrame((state) => {
          if (!mesh.current) return;
          mesh.current.rotation.z = state.clock.elapsedTime * ring.speed;
        });
        return (
          <mesh key={i} ref={mesh} position={[3, 0, -8]} rotation={[ring.tilt, 0, 0]}>
            <torusGeometry args={[ring.radius, 0.015, 16, 100]} />
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={0.5}
              transparent
              opacity={ring.opacity}
            />
          </mesh>
        );
      })}
    </>
  );
}

function FloatingDots({ count = 300 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#3b82f6" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export default function ResultsBackground({ savings = 0 }: { savings?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#3b82f6" />
        <SavingsOrb saving={savings} />
        <DataRings />
        <FloatingDots />
      </Canvas>
    </div>
  );
}
