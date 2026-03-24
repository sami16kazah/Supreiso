"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

type Box3DProps = {
  dimensions: { width: number, height: number, length: number, depth: number };
  sections: any[];
  isOpen: boolean;
  onSectionClick: (sectionName: string) => void;
  selectedSection?: string;
  texture?: string;
};

function BoxModel({ dimensions, sections, isOpen, onSectionClick, selectedSection, texture }: Box3DProps) {
  const { width, height, length } = dimensions;
  
  // Load texture if provided
  const boxTexture = texture ? useTexture(texture) : null;
  if (boxTexture) {
    boxTexture.wrapS = boxTexture.wrapT = THREE.RepeatWrapping;
  }
  
  // Animation state for the lid
  const lidRef = useRef<THREE.Group>(null);
  const targetRotation = isOpen ? -Math.PI * 0.75 : 0;

  useFrame((state, delta) => {
    if (lidRef.current) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetRotation,
        0.1
      );
    }
  });

  return (
    <group position={[0, -height / 2, 0]}>
      {/* Box Base (Bottom + 4 Sides) */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[width, 0.1, length]} />
        <meshStandardMaterial color={boxTexture ? "#ffffff" : "#fDFDFD"} map={boxTexture} />
      </mesh>

      {/* Side Walls */}
      <mesh position={[0, height / 2, length / 2]}>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color={boxTexture ? "#ffffff" : "#fDFDFD"} map={boxTexture} />
      </mesh>
      <mesh position={[0, height / 2, -length / 2]}>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color={boxTexture ? "#ffffff" : "#fDFDFD"} map={boxTexture} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.05, height, length]} />
        <meshStandardMaterial color={boxTexture ? "#ffffff" : "#fDFDFD"} map={boxTexture} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.05, height, length]} />
        <meshStandardMaterial color={boxTexture ? "#ffffff" : "#fDFDFD"} map={boxTexture} />
      </mesh>

      {/* Lid Group (Anchored at the back edge) */}
      <group ref={lidRef} position={[0, height, -length / 2]}>
        <mesh position={[0, 0, length / 2]}>
          <boxGeometry args={[width + 0.1, 0.1, length + 0.1]} />
          <meshStandardMaterial color={boxTexture ? "#ffffff" : "#fDFDFD"} map={boxTexture} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Interactive Sections */}
      {sections.map((section, idx) => {
        // Calculate position based on section index for now
        // In a real app, admin might define coordinates, but here we'll distribute them
        const totalSections = sections.length;
        const columns = Math.ceil(Math.sqrt(totalSections));
        const rows = Math.ceil(totalSections / columns);
        const col = idx % columns;
        const row = Math.floor(idx / columns);
        
        const secWidth = (width - 0.4) / columns;
        const secLength = (length - 0.4) / rows;
        
        const posX = -width / 2 + 0.2 + secWidth / 2 + col * secWidth;
        const posZ = -length / 2 + 0.2 + secLength / 2 + row * secLength;
        const posY = 0.2 + (section.level * (height / 3)); // Simple level offset

        const isSelected = selectedSection === section.name;

        return (
          <mesh 
            key={section.name} 
            position={[posX, posY, posZ]}
            onClick={(e) => {
              e.stopPropagation();
              onSectionClick(section.name);
            }}
          >
            <boxGeometry args={[secWidth - 0.1, 0.1, secLength - 0.1]} />
            <meshStandardMaterial 
              color={isSelected ? "#ec4899" : section.color || "#ffffff"} 
              opacity={0.8} 
              transparent 
              emissive={isSelected ? "#ec4899" : "#000000"}
              emissiveIntensity={isSelected ? 0.5 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Box3D({ dimensions, sections, isOpen, onSectionClick, selectedSection, texture }: Box3DProps) {
  const { width, height, length } = dimensions;
  const maxDim = Math.max(width, height, length);
  const cameraDist = maxDim * 1.8; // Bring it even closer

  return (
    <div className="w-full h-full min-h-[500px] flex-1 relative flex items-center justify-center">
      <Canvas 
        key={`${width}-${height}-${length}`}
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [cameraDist, cameraDist, cameraDist], fov: 28 }}
      >
        <OrbitControls enablePan={true} minDistance={maxDim * 0.5} maxDistance={maxDim * 5} makeDefault />
        
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        

        <BoxModel 
          dimensions={dimensions} 
          sections={sections} 
          isOpen={isOpen} 
          onSectionClick={onSectionClick} 
          selectedSection={selectedSection}
          texture={texture}
        />

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
        <Environment preset="city" />
      </Canvas>
      
      {!isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-black text-white uppercase tracking-widest animate-pulse">
              Open to Begin Customizing
           </div>
        </div>
      )}
    </div>
  );
}
