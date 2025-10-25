"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface BondVisualizerProps {
  atom1: string
  atom2: string
}

export function BondVisualizer({ atom1, atom2 }: BondVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const atom1X = 80
    const atom2X = canvas.width - 80
    const centerY = canvas.height / 2

    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(atom1X, centerY, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(atom1, atom1X, centerY)

    ctx.fillStyle = "#ec4899"
    ctx.beginPath()
    ctx.arc(atom2X, centerY, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.fillText(atom2, atom2X, centerY)

    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(atom1X + 30, centerY)
    ctx.lineTo(atom2X - 30, centerY)
    ctx.stroke()

    const electronCount = 4
    for (let i = 0; i < electronCount; i++) {
      const x = atom1X + 50 + (i * (atom2X - atom1X - 100)) / (electronCount - 1)
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.arc(x, centerY - 15, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [atom1, atom2])

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bond Visualization</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full border border-slate-200 rounded-lg bg-slate-50"
      />
    </Card>
  )
}
