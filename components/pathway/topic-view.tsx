"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TopicViewProps {
  pathway: {
    id: number
    title: string
    description: string
    order_number: number
    type: string
    content: any
  }
}

export default function TopicView({ pathway }: TopicViewProps) {
  const sections = pathway.content?.sections || []

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{pathway.title}</h2>
        <p className="text-lg text-gray-700">{pathway.description}</p>
      </Card>

      {sections.map((section: any, index: number) => (
        <Card key={index} className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
          <div className="prose prose-sm max-w-none">
            {section.content.split("\n").map((line: string, i: number) => (
              <p key={i} className="text-gray-700 mb-2 whitespace-pre-wrap">
                {line}
              </p>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex gap-4 pt-6">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            Kembali
          </Button>
        </Link>
        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">Lanjut ke Simulasi</Button>
      </div>
    </div>
  )
}
