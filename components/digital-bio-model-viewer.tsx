"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, Text } from "@react-three/drei"
import type { GLTF } from "three-stdlib"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCw, Info, Maximize, Minimize } from "lucide-react"
import type * as THREE from "three"
import type { DigitalBioModel } from "@/lib/digital-bio-api"

// Define the type for our GLTF result
type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

interface ModelProps {
  url: string
  annotations?: {
    id: string
    label: string
    description: string
    position: [number, number, number]
    color?: string
  }[]
}

// Model component that loads and displays the 3D model
function Model({ url, annotations = [] }: ModelProps) {
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

      {/* Render annotations */}
      {annotations.map((annotation) => (
        <Annotation
          key={annotation.id}
          position={annotation.position}
          label={annotation.label}
          description={annotation.description}
          color={annotation.color || "#ff0000"}
        />
      ))}
    </group>
  )
}

// Annotation component for highlighting specific parts of the model
function Annotation({
  position,
  label,
  description,
  color = "#ff0000",
}: {
  position: [number, number, number]
  label: string
  description: string
  color?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      {/* Hotspot */}
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ff9900" : color} transparent opacity={0.8} />
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
function Scene({ model }: { model: DigitalBioModel }) {
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
        <Model url={model.modelUrl} annotations={model.annotations} />

        {/* Add environment for better lighting */}
        <Environment preset="studio" />

        {/* Add text label at the bottom */}
        <Text position={[0, -3, 0]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
          {model.name}
        </Text>
      </Suspense>

      {/* Add orbit controls for user interaction */}
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} minDistance={5} maxDistance={20} />
    </>
  )
}

interface DigitalBioModelViewerProps {
  model: DigitalBioModel
  fullscreen?: boolean
  onToggleFullscreen?: () => void
}

// Main component that wraps the 3D scene in a card
export default function DigitalBioModelViewer({
  model,
  fullscreen = false,
  onToggleFullscreen,
}: DigitalBioModelViewerProps) {
  const [viewMode, setViewMode] = useState<"3d" | "info">("3d")

  return (
    <Card className={`w-full ${fullscreen ? "h-screen fixed top-0 left-0 z-50" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{model.name}</CardTitle>
            <CardDescription>{model.description}</CardDescription>
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
              variant={viewMode === "info" ? "default" : "outline"}
              onClick={() => setViewMode("info")}
              className="cursor-pointer"
            >
              Info
            </Badge>
            {onToggleFullscreen && (
              <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
                {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`relative ${fullscreen ? "h-[calc(100vh-200px)]" : "aspect-video"} w-full overflow-hidden rounded-md border bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900`}
        >
          {viewMode === "3d" ? (
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
              <Scene model={model} />
            </Canvas>
          ) : (
            <div className="p-4 h-full overflow-auto">
              <h3 className="text-lg font-medium mb-4">Model Information</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Gene</h4>
                  <p className="text-sm">{model.metadata.gene}</p>
                </div>

                {model.metadata.mutation && (
                  <div>
                    <h4 className="text-sm font-medium">Mutation</h4>
                    <p className="text-sm">{model.metadata.mutation}</p>
                  </div>
                )}

                {model.metadata.chromosome && model.metadata.position && (
                  <div>
                    <h4 className="text-sm font-medium">Genomic Location</h4>
                    <p className="text-sm">
                      Chromosome {model.metadata.chromosome}, Position {model.metadata.position}
                    </p>
                  </div>
                )}

                {model.metadata.pdbId && (
                  <div>
                    <h4 className="text-sm font-medium">PDB ID</h4>
                    <p className="text-sm">{model.metadata.pdbId}</p>
                  </div>
                )}

                {model.metadata.uniprotId && (
                  <div>
                    <h4 className="text-sm font-medium">UniProt ID</h4>
                    <p className="text-sm">{model.metadata.uniprotId}</p>
                  </div>
                )}

                {model.metadata.clinicalSignificance && (
                  <div>
                    <h4 className="text-sm font-medium">Clinical Significance</h4>
                    <p className="text-sm">{model.metadata.clinicalSignificance}</p>
                  </div>
                )}

                {model.metadata.source && (
                  <div>
                    <h4 className="text-sm font-medium">Data Source</h4>
                    <p className="text-sm">{model.metadata.source}</p>
                  </div>
                )}

                {model.annotations && model.annotations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">Annotations</h4>
                    <ul className="space-y-2 mt-2">
                      {model.annotations.map((annotation) => (
                        <li key={annotation.id} className="text-sm">
                          <span className="font-medium">{annotation.label}:</span> {annotation.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Controls overlay */}
          {viewMode === "3d" && (
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
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setViewMode("info")}>
                <Info className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Data source info */}
          <div className="absolute bottom-4 left-4 z-30 bg-white/80 dark:bg-slate-800/80 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Source: {model.metadata.source || "DigitalBio API"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
