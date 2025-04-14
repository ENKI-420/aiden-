"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, Text } from "@react-three/drei"
import type { GLTF } from "three-stdlib"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCw, Info } from "lucide-react"
import type * as THREE from "three"

// Define the type for our GLTF result
type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

// Model component that loads and displays the 3D model
function Model({ url = "/assets/3d/duck.glb" }: { url?: string }) {
  const gltf = useGLTF(url) as GLTFResult
  const modelRef = useRef<THREE.Group>(null)

  // Gentle auto-rotation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} scale={1.5} position={[0, 0, 0]} />
    </group>
  )
}

// Annotation component for highlighting specific parts of the model
function Annotation({
  position,
  label,
  description,
}: { position: [number, number, number]; label: string; description: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      {/* Hotspot */}
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ff9900" : "#ff0000"} transparent opacity={0.8} />
      </mesh>

      {/* Label */}
      {hovered && (
        <Html position={[0, 0.5, 0]} center distanceFactor={10}>
          <div className="bg-white dark:bg-slate-800 p-2 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 w-48">
            <h4 className="font-bold text-sm">{label}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

// Scene component that composes the entire 3D scene
function Scene() {
  const { camera } = useThree()

  // Set initial camera position
  useState(() => {
    camera.position.set(0, 0, 10)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading 3D model...</p>
            </div>
          </Html>
        }
      >
        <Model />

        {/* Add annotations for specific genomic features */}
        <Annotation
          position={[2, 0, 0]}
          label="BRAF V600E Mutation"
          description="Common mutation in melanoma that substitutes valine with glutamic acid at position 600"
        />

        <Annotation
          position={[-2, 1, 0]}
          label="EGFR Exon 19 Deletion"
          description="Common in non-small cell lung cancer, associated with response to EGFR TKIs"
        />

        <Annotation
          position={[0, 2, 1]}
          label="KRAS G12C Mutation"
          description="Found in lung and colorectal cancers, historically difficult to target"
        />

        {/* Add environment for better lighting */}
        <Environment preset="studio" />

        {/* Add text label at the bottom */}
        <Text position={[0, -3, 0]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
          Genomic Structure Model
        </Text>
      </Suspense>

      {/* Add orbit controls for user interaction */}
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} minDistance={5} maxDistance={20} />
    </>
  )
}

// Main component that wraps the 3D scene in a card
export default function Genomic3DViewer() {
  const [viewMode, setViewMode] = useState<"3d" | "linear" | "protein">("3d")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Interactive Genomic Structure</CardTitle>
            <CardDescription>3D visualization of genomic mutations and structures</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={viewMode === "3d" ? "default" : "outline"}
              onClick={() => setViewMode("3d")}
              className="cursor-pointer"
            >
              3D View
            </Badge>
            <Badge
              variant={viewMode === "linear" ? "default" : "outline"}
              onClick={() => setViewMode("linear")}
              className="cursor-pointer"
            >
              Linear View
            </Badge>
            <Badge
              variant={viewMode === "protein" ? "default" : "outline"}
              onClick={() => setViewMode("protein")}
              className="cursor-pointer"
            >
              Protein View
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
          {viewMode === "3d" && (
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
              <Scene />
            </Canvas>
          )}

          {viewMode === "linear" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Linear View</h3>
                <p className="text-sm text-muted-foreground">Linear genomic visualization coming soon</p>
              </div>
            </div>
          )}

          {viewMode === "protein" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Protein View</h3>
                <p className="text-sm text-muted-foreground">Protein structure visualization coming soon</p>
              </div>
            </div>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 z-30 flex gap-2 bg-white/80 dark:bg-slate-800/80 p-2 rounded-md">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Data source info */}
          <div className="absolute bottom-4 left-4 z-30 bg-white/80 dark:bg-slate-800/80 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Data source: NCBI GenBank, PDB</p>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-medium">Genomic Information</p>
          <p className="text-muted-foreground">
            This 3D model visualizes key genomic mutations associated with cancer. Hover over the highlighted points to
            see details about specific mutations. Use mouse to rotate, zoom, and pan the model.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Currently using a placeholder 3D model for demonstration purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
