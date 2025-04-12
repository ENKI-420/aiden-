"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, useAnimations, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type * as THREE from "three"

// Human model component
function HumanModel({
  modelType,
  activeLayer,
  opacity,
  highlightOrgan = null,
}: {
  modelType: "full-body" | "cardiac" | "neurological"
  activeLayer: string
  opacity: number
  highlightOrgan?: string | null
}) {
  // Use different models based on the modelType
  const modelPath =
    modelType === "full-body"
      ? "/assets/3d/human_model.glb"
      : modelType === "cardiac"
        ? "/assets/3d/heart_model.glb"
        : "/assets/3d/brain_model.glb"

  // For demo purposes, we'll use a placeholder model
  // In a real app, you would use actual anatomical models
  const { scene, animations } = useGLTF("https://models.readyplayer.me/64c9bf7b1ddb83d9b8a9fae2.glb")
  const modelRef = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, modelRef)

  // Play idle animation if available
  useFrame(() => {
    if (modelRef.current) {
      if (modelType === "full-body") {
        // Subtle rotation for the model
        modelRef.current.rotation.y += 0.001
      }
    }
  })

  // Start idle animation if available
  useState(() => {
    if (actions && actions.Idle) {
      actions.Idle.play()
    }
  })

  // Apply material modifications based on layer and opacity
  const materialProps = {
    transparent: opacity < 1,
    opacity: opacity,
    // Add more material properties based on the active layer
  }

  return (
    <group ref={modelRef}>
      <primitive
        object={scene}
        scale={modelType === "full-body" ? 1.5 : 2.5}
        position={[0, modelType === "full-body" ? -1.5 : -0.5, 0]}
      />

      {/* Add annotations based on the model type and active layer */}
      {activeLayer === "annotations" && (
        <>
          {modelType === "full-body" && (
            <>
              <Html position={[0.5, 0.5, 0.5]}>
                <div className="bg-background/80 p-2 rounded-md shadow-md border border-border">
                  <p className="text-sm font-medium">Heart Rate</p>
                  <p className="text-xs text-muted-foreground">72 BPM</p>
                </div>
              </Html>
              <Html position={[-0.5, -0.2, 0.5]}>
                <div className="bg-background/80 p-2 rounded-md shadow-md border border-border">
                  <p className="text-sm font-medium">Blood Pressure</p>
                  <p className="text-xs text-muted-foreground">120/80 mmHg</p>
                </div>
              </Html>
            </>
          )}

          {modelType === "cardiac" && (
            <Html position={[0, 0, 1]}>
              <div className="bg-background/80 p-2 rounded-md shadow-md border border-border">
                <p className="text-sm font-medium">Ejection Fraction</p>
                <p className="text-xs text-muted-foreground">58%</p>
              </div>
            </Html>
          )}

          {modelType === "neurological" && (
            <Html position={[0, 0.5, 0.5]}>
              <div className="bg-background/80 p-2 rounded-md shadow-md border border-border">
                <p className="text-sm font-medium">Brain Activity</p>
                <p className="text-xs text-muted-foreground">Normal</p>
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  )
}

function ModelLoader() {
  const { progress } = useThree()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Loading model... {Math.round(progress * 100)}%</p>
      </div>
    </Html>
  )
}

export function PatientModelViewer({
  modelType = "full-body",
  patientId,
}: {
  modelType: "full-body" | "cardiac" | "neurological"
  patientId: string
}) {
  const [activeLayer, setActiveLayer] = useState("surface")
  const [opacity, setOpacity] = useState(100)
  const [annotations, setAnnotations] = useState(true)
  const [highlightOrgan, setHighlightOrgan] = useState<string | null>(null)
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5])
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  const resetCamera = () => {
    setCameraPosition([0, 0, 5])
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }

  const zoomIn = () => {
    setCameraPosition([cameraPosition[0], cameraPosition[1], cameraPosition[2] - 1])
  }

  const zoomOut = () => {
    setCameraPosition([cameraPosition[0], cameraPosition[1], cameraPosition[2] + 1])
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden">
        <div className="relative w-full h-[600px]">
          <Canvas camera={{ position: cameraPosition, fov: 50 }}>
            <Suspense fallback={<ModelLoader />}>
              <PerspectiveCamera ref={cameraRef} makeDefault position={cameraPosition} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <HumanModel
                modelType={modelType}
                activeLayer={annotations ? "annotations" : activeLayer}
                opacity={opacity / 100}
                highlightOrgan={highlightOrgan}
              />
              <Environment preset="studio" />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>

          {/* Camera controls */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Button variant="secondary" size="icon" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={resetCamera}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-4 right-4 bg-background/80 p-4 rounded-md border border-border w-64 space-y-4">
            <Tabs defaultValue="layers" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="layers" className="flex-1">
                  Layers
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex-1">
                  Tools
                </TabsTrigger>
              </TabsList>
              <TabsContent value="layers" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="layer-select">Active Layer</Label>
                    <select
                      id="layer-select"
                      className="text-sm p-1 rounded-md bg-background border border-input"
                      value={activeLayer}
                      onChange={(e) => setActiveLayer(e.target.value)}
                    >
                      <option value="surface">Surface</option>
                      <option value="skeletal">Skeletal</option>
                      <option value="muscular">Muscular</option>
                      <option value="vascular">Vascular</option>
                      <option value="nervous">Nervous</option>
                      <option value="organs">Organs</option>
                    </select>
                  </div>

                  {activeLayer === "organs" && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor="organ-select">Highlight Organ</Label>
                      <select
                        id="organ-select"
                        className="text-sm p-1 rounded-md bg-background border border-input"
                        value={highlightOrgan || ""}
                        onChange={(e) => setHighlightOrgan(e.target.value || null)}
                      >
                        <option value="">None</option>
                        <option value="heart">Heart</option>
                        <option value="lungs">Lungs</option>
                        <option value="liver">Liver</option>
                        <option value="kidneys">Kidneys</option>
                        <option value="brain">Brain</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="opacity">Opacity</Label>
                      <span className="text-sm text-muted-foreground">{opacity}%</span>
                    </div>
                    <Slider
                      id="opacity"
                      min={10}
                      max={100}
                      step={1}
                      value={[opacity]}
                      onValueChange={(value) => setOpacity(value[0])}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="annotations">Annotations</Label>
                    <Switch id="annotations" checked={annotations} onCheckedChange={setAnnotations} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tools" className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Measure
                  </Button>
                  <Button variant="outline" size="sm">
                    Cross-section
                  </Button>
                  <Button variant="outline" size="sm">
                    Compare
                  </Button>
                  <Button variant="outline" size="sm">
                    Screenshot
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Patient ID: {patientId}
                <br />
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
