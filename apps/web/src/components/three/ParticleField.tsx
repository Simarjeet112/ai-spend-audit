"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function StarField({ count = 2000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function BlueDust({ count = 600 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = -state.clock.elapsedTime * 0.015;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#3b82f6" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function GlowOrb({ position, color, scale }: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    mesh.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.15}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function FloatingGrid() {
  const mesh = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const size = 20;
    const divisions = 12;
    const step = size / divisions;

    for (let i = 0; i <= divisions; i++) {
      const x = -size / 2 + i * step;
      points.push(x, -8, -5, x, -8, -5 + size);
    }
    for (let i = 0; i <= divisions; i++) {
      const z = -5 + i * step;
      points.push(-size / 2, -8, z, size / 2, -8, z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.z = ((state.clock.elapsedTime * 0.8) % 1.67);
  });

  return (
    <lineSegments ref={mesh} geometry={geometry}>
      <lineBasicMaterial color="#2563eb" transparent opacity={0.12} />
    </lineSegments>
  );
}

function NetworkLines({ count = 40 }: { count?: number }) {
  const mesh = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 24;
      const y1 = (Math.random() - 0.5) * 16;
      const z1 = (Math.random() - 0.5) * 8 - 4;
      const x2 = x1 + (Math.random() - 0.5) * 6;
      const y2 = y1 + (Math.random() - 0.5) * 6;
      const z2 = z1 + (Math.random() - 0.5) * 2;
      points.push(x1, y1, z1, x2, y2, z2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.04;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <lineSegments ref={mesh} geometry={geometry}>
      <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} />
    </lineSegments>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1d4ed8" />

        <StarField />
        <BlueDust />
        <NetworkLines />
        <FloatingGrid />

        <GlowOrb position={[6, 2, -3]} color="#2563eb" scale={3} />
        <GlowOrb position={[-8, -1, -5]} color="#1d4ed8" scale={2} />
        <GlowOrb position={[2, -3, -2]} color="#3b82f6" scale={1.5} />
      </Canvas>
    </div>
  );
}
