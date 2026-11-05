"use client";

import { useMemo } from "react";
import * as THREE from "three";

function lighten(hex: string, amount: number): string {
  const c = new THREE.Color(hex);
  c.lerp(new THREE.Color("#ffffff"), amount);
  return `#${c.getHexString()}`;
}

export function FabricMaterial({ color }: { color: string }) {
  const sheen = useMemo(() => lighten(color, 0.35), [color]);
  return <meshPhysicalMaterial color={color} roughness={0.92} metalness={0} sheen={0.7} sheenRoughness={0.7} sheenColor={sheen} />;
}

export function WoodMaterial({ color }: { color: string }) {
  return <meshStandardMaterial color={color} roughness={0.45} metalness={0.04} />;
}

export function MetalMaterial({ color = "#1a1a1a" }: { color?: string }) {
  return <meshStandardMaterial color={color} roughness={0.35} metalness={0.9} />;
}

export function MattressMaterial() {
  return <meshPhysicalMaterial color="#f3efe6" roughness={0.95} sheen={0.4} sheenColor="#ffffff" />;
}

export { lighten };
