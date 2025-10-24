"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Experiment {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export function LabCard({ experiment }: { experiment: Experiment }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`bg-gradient-to-br ${experiment.color} h-24 flex items-center justify-center`}>
        <span className="text-5xl">{experiment.icon}</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{experiment.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{experiment.description}</p>
        <Link href={`/lab/${experiment.id}`}>
          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Start Experiment
          </Button>
        </Link>
      </div>
    </Card>
  )
}
