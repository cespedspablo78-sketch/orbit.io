"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Real-time 3D hero scene (hero canvas only — rest of the page is DOM).
 * Layers: far stars → nebula → particles → fog → orbit rings → 3D TON
 * coins → platform → energy/glow (bloom). The Orbiter PNG is layered
 * over this canvas in the DOM.
 *
 * Performance budget: dpr capped at [1,2], 6 low-poly coins, bloom only
 * here, no imported models, no shadows.
 */

const TON_BLUE = "#0098EA";
const TON_BRIGHT = "#33BBFF";

/* ---------- camera rig: mouse parallax + slow cinematic drift ---------- */
function Rig() {
  useFrame(({ camera, pointer, clock }) => {
    const t = clock.elapsedTime;
    const tx = pointer.x * 0.55 + Math.sin(t * 0.08) * 0.22;
    const ty = 0.4 + pointer.y * 0.3 + Math.cos(t * 0.06) * 0.12;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------- nebula (soft emissive planes, generated texture) ---------- */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(24,86,150,0.55)");
    g.addColorStop(0.5, "rgba(18,64,128,0.2)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Nebula() {
  const tex = useGlowTexture();
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.04) * 0.05;
  });
  return (
    <group ref={ref}>
      {/* main glow concentrated behind the character — corners stay near-black */}
      <mesh position={[2.2, 0.3, -7]}>
        <planeGeometry args={[11, 8]} />
        <meshBasicMaterial map={tex} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[-5.5, 1, -11]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial map={tex} transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[6, 3.5, -12]}>
        <planeGeometry args={[12, 7]} />
        <meshBasicMaterial map={tex} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- ambient particles drifting upward ---------- */
function Particles({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 18;
      a[i * 3 + 1] = (Math.random() - 0.5) * 10;
      a[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return a;
  }, [count]);

  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    const attr = p.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + dt * 0.12;
      if (y > 5.2) y = -5.2;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={TON_BRIGHT} size={0.03} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ---------- metallic 3D TON coin ---------- */
const tonShape = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.27, 0.17);
  s.lineTo(0.27, 0.17);
  s.lineTo(0, -0.31);
  s.closePath();
  return s;
})();

function Coin({
  radius,
  height,
  scale = 1,
  speed = 1,
  phase = 0,
  tilt = 0.25,
}: {
  radius: number;
  height: number;
  scale?: number;
  speed?: number;
  phase?: number;
  tilt?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    // slow elliptical orbit around the character
    const a = t * 0.22 * speed + phase;
    g.position.x = Math.cos(a) * radius;
    g.position.z = Math.sin(a) * radius * 0.55;
    g.position.y = height + Math.sin(t * 0.6 * speed + phase) * 0.1;
    // subtle spin
    g.rotation.y = t * 0.25 * speed + phase;
  });
  return (
    <group ref={ref} scale={scale} rotation={[tilt, 0, tilt * 0.6]}>
      {/* body — metallic, reflective, blue emissive */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 48]} />
        <meshStandardMaterial color="#141C28" metalness={0.9} roughness={0.15} emissive={TON_BLUE} emissiveIntensity={0.12} />
      </mesh>
      {/* glowing TON glyph, both faces */}
      <mesh position={[0, 0, 0.052]}>
        <shapeGeometry args={[tonShape]} />
        <meshBasicMaterial color="#5CCFFF" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.052]} rotation={[0, Math.PI, 0]}>
        <shapeGeometry args={[tonShape]} />
        <meshBasicMaterial color="#5CCFFF" side={THREE.DoubleSide} />
      </mesh>
      {/* edge rim glow */}
      <mesh>
        <torusGeometry args={[0.5, 0.012, 8, 64]} />
        <meshBasicMaterial color={TON_BLUE} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ---------- orbit ring with travelling satellite ---------- */
function OrbitRing({
  radius,
  tilt,
  speed,
  opacity,
}: {
  radius: number;
  tilt: number;
  speed: number;
  opacity: number;
}) {
  const sat = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (sat.current) sat.current.rotation.z = clock.elapsedTime * speed;
  });
  return (
    <group rotation={[tilt, 0, 0.08]} position={[0, -0.2, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.007, 12, 180]} />
        <meshBasicMaterial color={TON_BLUE} transparent opacity={opacity} />
      </mesh>
      <group ref={sat}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#7FDBFF" />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- launch-pad platform ---------- */
function Platform() {
  const arc = useRef<THREE.Group>(null);
  const r1 = useRef<THREE.MeshBasicMaterial>(null);
  const r2 = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (arc.current) arc.current.rotation.y = t * 0.6;
    if (r1.current) r1.current.opacity = 0.65 + Math.sin(t * 2.2) * 0.28;
    if (r2.current) r2.current.opacity = 0.55 + Math.sin(t * 2.2 + 1.2) * 0.28;
  });
  return (
    <group position={[0, -1.55, 0]}>
      {/* base disc */}
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[2.0, 2.15, 0.22, 64]} />
        <meshStandardMaterial color="#0A111C" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* reflective top face */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[2.0, 64]} />
        <meshStandardMaterial color="#070D17" metalness={0.9} roughness={0.2} emissive="#00335E" emissiveIntensity={0.35} />
      </mesh>
      {/* concentric neon rings (pulsing) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[1.8, 0.022, 8, 128]} />
        <meshBasicMaterial ref={r1} color={TON_BLUE} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[1.42, 0.016, 8, 128]} />
        <meshBasicMaterial ref={r2} color={TON_BRIGHT} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[1.0, 0.012, 8, 96]} />
        <meshBasicMaterial color={TON_BLUE} transparent opacity={0.45} />
      </mesh>
      {/* rotating energy arc */}
      <group ref={arc}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <torusGeometry args={[1.62, 0.03, 8, 100, Math.PI * 0.65]} />
          <meshBasicMaterial color="#7FDBFF" transparent opacity={0.9} />
        </mesh>
      </group>
      {/* platform light — illuminates nearby coins */}
      <pointLight position={[0, 0.8, 0]} color={TON_BLUE} intensity={4} distance={7} decay={2} />
    </group>
  );
}

/* ---------- low volumetric-style fog hugging the platform ---------- */
function GroundFog() {
  const tex = useGlowTexture();
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (a.current) {
      a.current.position.x = Math.sin(t * 0.07) * 0.7;
      (a.current.material as THREE.MeshBasicMaterial).opacity = 0.22 + Math.sin(t * 0.4) * 0.06;
    }
    if (b.current) {
      b.current.position.x = Math.cos(t * 0.05) * 0.9;
      (b.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.cos(t * 0.3) * 0.05;
    }
  });
  return (
    <group position={[0, -1.45, 0]}>
      <mesh ref={a} position={[0, 0.1, 0.6]}>
        <planeGeometry args={[7, 2.4]} />
        <meshBasicMaterial map={tex} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={b} position={[0, 0.4, -0.8]}>
        <planeGeometry args={[9, 3]} />
        <meshBasicMaterial map={tex} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- distant planet ---------- */
function Planet() {
  return (
    <mesh position={[4.6, 3.2, -8]}>
      <sphereGeometry args={[2.6, 48, 48]} />
      <meshStandardMaterial color="#0D1626" roughness={0.85} metalness={0.2} />
    </mesh>
  );
}

/* ---------- hero group — centered (mascot sits in the middle column) ---------- */
function HeroGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (0 - ref.current.position.x) * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

export default function Scene3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 6.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#03050A"]} />
      <fog attach="fog" args={["#03050A", 10, 24]} />

      {/* cinematic lighting: ambient + cool key + blue rim (dialed back 30% for calm) */}
      <ambientLight intensity={0.25} color="#7FB3E8" />
      <directionalLight position={[-5, 4, 5]} intensity={0.77} color="#BFE3FF" />
      <pointLight position={[3, 2, -3]} intensity={1.75} color={TON_BLUE} distance={14} decay={2} />

      <Stars radius={60} depth={40} count={1800} factor={3} saturation={0} fade speed={0.35} />
      <Nebula />
      <Particles count={132} />
      <Planet />

      <HeroGroup>
        <OrbitRing radius={1.55} tilt={1.25} speed={0.25} opacity={0.5} />
        <OrbitRing radius={1.85} tilt={1.12} speed={-0.16} opacity={0.32} />
        <OrbitRing radius={2.15} tilt={0.98} speed={0.11} opacity={0.18} />

        <Coin radius={2.5} height={1.5} scale={0.5} speed={1} phase={0.4} tilt={0.3} />
        <Coin radius={2.9} height={1.9} scale={0.65} speed={0.8} phase={2.1} tilt={-0.25} />
        <Coin radius={2.7} height={0.2} scale={0.55} speed={1.1} phase={4.2} tilt={0.2} />
        <Coin radius={2.4} height={-0.5} scale={0.4} speed={0.9} phase={1.3} tilt={-0.3} />
        <Coin radius={3.1} height={2.5} scale={0.33} speed={1.2} phase={3.3} tilt={0.35} />
        <Coin radius={3.3} height={1.1} scale={0.3} speed={0.7} phase={5.1} tilt={-0.2} />

        <Platform />
        <GroundFog />
      </HeroGroup>

      <Rig />

      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={2.5} />
        <Bloom intensity={0.77} luminanceThreshold={0.26} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.12} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  );
}
