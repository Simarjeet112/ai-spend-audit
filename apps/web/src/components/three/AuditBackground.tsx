"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingCubes({ count = 12 }: { count?: number }) {
  const meshes = useRef<THREE.Mesh[]>([]);

  const data = useMemo(() =>
    Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6 - 6,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      speed: 0.003 + Math.random() * 0.004,
      floatOffset: Math.random() * Math.PI * 2,
      scale: 0.15 + Math.random() * 0.3,
    })), [count]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.x += data[i].speed;
      mesh.rotation.y += data[i].speed * 0.7;
      mesh.position.y =
        data[i].position[1] + Math.sin(t * 0.5 + data[i].floatOffset) * 0.4;
    });
  });

  return (
    <>
      {data.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshes.current[i] = el; }}
          position={d.position}
          rotation={d.rotation}
          scale={d.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#2563eb"
            emissive="#1d4ed8"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
}

function Ring() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.z = t * 0.08;
  });
  return (
    <mesh ref={mesh} position={[5, 0, -4]}>
      <torusGeometry args={[2.5, 0.02, 16, 80]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} transparent opacity={0.3} />
    </mesh>
  );
}

function Ring2() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.12;
    mesh.current.rotation.x = t * 0.06;
  });
  return (
    <mesh ref={mesh} position={[-6, 1, -5]}>
      <torusGeometry args={[2, 0.015, 16, 80]} />
      <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.4} transparent opacity={0.2} />
    </mesh>
  );
}

function Particles({ count = 400 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#3b82f6" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function AuditBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#3b82f6" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#1d4ed8" />
        <FloatingCubes />
        <Ring />
        <Ring2 />
        <Particles />
      </Canvas>
    </div>
  );
}
