"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Genomic3DViewer from "./genomic-3d-viewer"

function Genomic3DModelGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Genomic 3D Model Generator</CardTitle>
        <CardDescription>Visualize genomic data in 3D</CardDescription>
      </CardHeader>
      <CardContent>
        <Genomic3DViewer />
      </CardContent>
    </Card>
  )
}

// Add named export
export { Genomic3DModelGenerator }

// Default export remains the same
export default Genomic3DModelGenerator
