import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshWobbleMaterial, Float, Stars, Text } from '@react-three/drei';

function InteractiveShape() {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        ref={meshRef}
        scale={clicked ? 1.4 : 1.1}
        onClick={() => setClicked(!clicked)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshWobbleMaterial
          color={hovered ? '#ff4081' : '#00e5ff'}
          factor={hovered ? 0.6 : 0.2}
          speed={3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090a0f', overflow: 'hidden', position: 'relative' }}>
      {/* 3D Canvas Viewport */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#ff4081" intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
        
        <InteractiveShape />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>

      {/* HTML Overlay Content */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', fontWeight: '800', letterSpacing: '-1px' }}>
          Interactive 3D Experience
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aec0', maxWidth: '500px', marginBottom: '30px' }}>
          Hover over or click the floating 3D shape to interact with it, or drag the background to rotate the camera.
        </p>
        <button 
          onClick={() => alert("Welcome to the 3D App!")}
          style={{
            pointerEvents: 'auto',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #00e5ff 0%, #ff4081 100%)',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 229, 255, 0.4)'
          }}
        >
          Explore Project
        </button>
      </div>
    </div>
  );
}