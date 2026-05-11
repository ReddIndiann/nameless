import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

interface Tshirt3DProps {
  textureUrl?: string
}

/**
 * A procedural T-shirt shape built from Three.js geometry.
 * No external GLB dependency — always works offline.
 */
function TshirtMesh({ textureUrl }: Tshirt3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load design texture from the data URL captured by Konva
  const designTexture = useMemo(() => {
    if (!textureUrl) return null
    const tex = new THREE.TextureLoader().load(textureUrl)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [textureUrl])

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      groupRef.current.rotation.y = Math.sin(t / 3) * 0.15
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} dispose={null}>
        {/* T-shirt body — a softened box */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 2, 0.4, 16, 16, 4]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.85}
            metalness={0.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Design decal — mapped on front face */}
        {designTexture && (
          <mesh position={[0, 0.1, 0.201]}>
            <planeGeometry args={[1.2, 1.4]} />
            <meshStandardMaterial
              map={designTexture}
              transparent
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        )}

        {/* Left sleeve */}
        <mesh castShadow position={[-1.1, 0.55, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.7, 0.65, 0.35, 8, 8, 4]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.85} />
        </mesh>

        {/* Right sleeve */}
        <mesh castShadow position={[1.1, 0.55, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.7, 0.65, 0.35, 8, 8, 4]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.85} />
        </mesh>

        {/* Collar */}
        <mesh position={[0, 1.05, 0]}>
          <torusGeometry args={[0.3, 0.06, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#111122" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  )
}

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 2
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#ef4444" wireframe />
    </mesh>
  )
}

export const Tshirt3D = ({ textureUrl }: Tshirt3DProps) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950/50 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative group">
      <Canvas 
        shadows 
        camera={{ position: [0, 0.5, 4], fov: 30 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 5, 15]} />
        
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[5, 8, 5]} 
          angle={0.2} 
          penumbra={1} 
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4f46e5" />
        <pointLight position={[3, -2, 4]} intensity={0.3} color="#ef4444" />
        
        <Suspense fallback={<LoadingFallback />}>
          <TshirtMesh textureUrl={textureUrl} />
          <Environment preset="city" environmentIntensity={0.3} />
          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={0.4} 
            scale={8} 
            blur={2.5} 
            far={3} 
          />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={2.5}
          maxDistance={7}
        />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Drag to Rotate · Scroll to Zoom
      </div>
    </div>
  )
}
