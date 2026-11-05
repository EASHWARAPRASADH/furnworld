"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { BuilderConfig } from "@/lib/types";
import { swatchHex, type BuilderState } from "@/lib/builder";
import { Bed, DiningTable, LoungeChair, Sofa } from "./Furniture";

/** Picks the right procedural model for the current builder state. */
export function FurnitureModel({ state, config }: { state: BuilderState; config: BuilderConfig }) {
  const fabric = swatchHex(config, "fabrics", state.fabric, "#d9cbb4");
  const wood = swatchHex(config, "woods", state.wood, "#8b5a2b");
  switch (state.model) {
    case "chair":
      return <LoungeChair fabric={fabric} wood={wood} leg={state.leg} ottoman={state.ottoman} />;
    case "bed":
      return <Bed size={state.size} headboard={state.headboard} storage={state.storage} fabric={fabric} wood={wood} />;
    case "dining":
      return <DiningTable shape={state.shape} seats={state.seats} leg={state.leg} wood={wood} fabric={fabric} />;
    default:
      return <Sofa seats={state.seats} arm={state.arm} leg={state.leg} fabric={fabric} wood={wood} />;
  }
}

export function Studio({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.6 * intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-5, 3, -2]} intensity={0.5 * intensity} color="#ffe8d6" />
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="rect" intensity={2} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[10, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="ring" intensity={1} color="#ffd6b0" position={[0, 6, 4]} scale={3} />
        </group>
      </Environment>
    </>
  );
}

/** Slowly spins until the user drags; then stops. */
function AutoRotate({ children, speed = 0.15, enabled = true }: { children: ReactNode; speed?: number; enabled?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && enabled) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
}

function PointerParallax({ children, amount = 0.25 }: { children: ReactNode; amount?: number }) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current.x * amount, 0.04);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.y * amount * 0.4, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function GlBridge({ onReady }: { onReady?: (gl: THREE.WebGLRenderer) => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => { onReady?.(gl); }, [gl, onReady]);
  return null;
}

/** Hero: floating, parallax, no controls. */
export function HeroCanvas({ state, config, className = "" }: { state: BuilderState; config: BuilderConfig; className?: string }) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [3.2, 1.9, 4.2], fov: 32 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Studio />
        <PointerParallax>
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.04, 0.06]}>
            <group position={[0, -0.45, 0]} rotation={[0, -0.5, 0]}>
              <FurnitureModel state={state} config={config} />
            </group>
          </Float>
        </PointerParallax>
        <ContactShadows position={[0, -0.46, 0]} opacity={0.55} scale={8} blur={2.4} far={2} color="#000" />
      </Suspense>
    </Canvas>
  );
}

/** Builder: orbit controls, auto rotate until interaction, snapshot support. */
export type CameraView = "angle" | "front" | "side" | "top";

/** Scales the model up briefly whenever its configuration changes. */
function Bump({ children, trigger }: { children: ReactNode; trigger: string }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(1);
  useEffect(() => { t.current = 0; }, [trigger]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    t.current = Math.min(1, t.current + delta * 1.6);
    const k = t.current;
    const s = 1 + Math.sin(k * Math.PI) * 0.035 * (1 - k);
    ref.current.scale.setScalar(s);
  });
  return <group ref={ref}>{children}</group>;
}

export function BuilderCanvas({
  state,
  config,
  onReady,
  view = "angle",
  className = "",
}: {
  state: BuilderState;
  config: BuilderConfig;
  onReady?: (gl: THREE.WebGLRenderer) => void;
  view?: CameraView;
  className?: string;
}) {
  const interacted = useRef(false);
  const dist = state.model === "bed" ? 5.2 : state.model === "dining" ? 5.4 : state.model === "chair" ? 3.4 : 4.2 + state.seats * 0.25;
  const bumpKey = JSON.stringify(state);
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      camera={{ position: [dist * 0.75, dist * 0.45, dist * 0.8], fov: 30 }}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <GlBridge onReady={onReady} />
        <Studio />
        <CameraRig distance={dist} view={view} />
        <AutoRotate speed={0.12} enabled={view === "angle"}>
          <Bump trigger={bumpKey}>
            <group position={[0, state.model === "bed" ? -0.5 : -0.4, 0]}>
              <FurnitureModel state={state} config={config} />
            </group>
          </Bump>
        </AutoRotate>
        <ContactShadows position={[0, state.model === "bed" ? -0.51 : -0.41, 0]} opacity={0.5} scale={10} blur={2.2} far={3} color="#000" />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={9}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableDamping
          dampingFactor={0.08}
          onStart={() => { interacted.current = true; }}
        />
      </Suspense>
    </Canvas>
  );
}

const VIEW_DIRS: Record<CameraView, THREE.Vector3> = {
  angle: new THREE.Vector3(0.75, 0.45, 0.8).normalize(),
  front: new THREE.Vector3(0, 0.18, 1).normalize(),
  side: new THREE.Vector3(1, 0.18, 0).normalize(),
  top: new THREE.Vector3(0.001, 1, 0.25).normalize(),
};

/** Eases the camera to the right distance for the model and, for named views, to a fixed direction. */
function CameraRig({ distance, view }: { distance: number; view: CameraView }) {
  const { camera } = useThree();
  const target = useRef(distance);
  const dirTarget = useRef<THREE.Vector3 | null>(null);
  useEffect(() => { target.current = distance; }, [distance]);
  useEffect(() => { dirTarget.current = view === "angle" ? null : VIEW_DIRS[view].clone(); }, [view]);
  useFrame(() => {
    const dir = camera.position.clone().normalize();
    if (dirTarget.current) {
      dir.lerp(dirTarget.current, 0.08).normalize();
      if (dir.distanceTo(dirTarget.current) < 0.002) dirTarget.current = null;
    }
    const current = camera.position.length();
    const next = THREE.MathUtils.lerp(current, target.current, 0.05);
    camera.position.copy(dir.multiplyScalar(next));
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}
