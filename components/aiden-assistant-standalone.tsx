"use client"

import type React from "react"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AidenAssistantProps {
  name?: string
  description?: React.ReactNode
  logoSrc?: string
  myChartLink?: string
}

const defaultProps: AidenAssistantProps = {
  name: "AIDEN Assistant",
  description: (
    <>
      <p>GPT-4o Powered</p>
      <br />
      <p>
        AGILE - Adaptive Genomic Insights for Laboratory Evaluations
        <br />
        Norton Cancer Institute Assistant
        <br />- powered by AIDEN
        <br />
        from Agile Defense Systems CAGE code: 9HUP5
      </p>
    </>
  ),
  logoSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tzDzhAK6s9cbSCe4c0hIdspQ1U4R1K.png",
  myChartLink: "https://mychart.nortonhealthcare.org/",
}

const AidenAssistant: React.FC<AidenAssistantProps> = (props) => {
  const { name, description, logoSrc, myChartLink } = { ...defaultProps, ...props }

  return (
    <Card className="w-full max-w-md border-norton-blue shadow-lg">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
        <Image
          src={logoSrc || "/placeholder.svg"}
          alt="Agile Defense Systems Logo"
          width={200}
          height={50}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-norton-blue">{name}</h1>
        <div className="text-center text-muted-foreground">{description}</div>
        <div className="flex flex-col gap-2 w-full">
          <Button asChild className="w-full bg-norton-blue hover:bg-norton-teal">
            <a href={myChartLink} target="_blank" rel="noopener noreferrer">
              Access MyChart
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/aiden" rel="noopener noreferrer">
              Open AIDEN Assistant
            </a>
          </Button>
        </div>
        <Badge variant="outline" className="mt-2">
          HIPAA Compliant & Secure
        </Badge>
      </CardContent>
    </Card>
  )
}

export default AidenAssistant
