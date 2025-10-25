"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

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

function getVideoIdByPathwayId(pathwayId: number): string {
  const videoMapping: { [key: number]: string } = {
    1: '7rodnBMRdCw', // Pathway (Topik 1) - Ikatan Kimia
    4: '5x_2ctPpArM', // Pathway (Topik 2) - Video Topik 2
  }
  return videoMapping[pathwayId] || 'dQw4w9WgXcQ' 
}

export default function TopicView({ pathway }: TopicViewProps) {
  const sections = pathway.content?.sections || []
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsCompleting(true)
    
    try {
      console.log('[Client] Completing pathway:', pathway.id)

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathwayId: pathway.id,
          status: 'completed',
        }),
      })

      console.log('[Client] Response status:', response.status)

      const data = await response.json()
      console.log('[Client] Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update progress')
      }

      console.log('[Client] Success!')

      if (data.nextPathwayId) {
        console.log('[Client] Navigating to next pathway:', data.nextPathwayId)
        router.push(`/pathway/${data.nextPathwayId}`)
        router.refresh() 
      } else {

        console.log('[Client] No next pathway, going to dashboard')
        router.push('/dashboard')
        router.refresh() 
      }
    } catch (error) {
      console.error('[Client] Error:', error)
      alert(`Gagal menyelesaikan pembelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <article className="space-y-6">
      <header>
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{pathway.title}</h2>
          <p className="text-lg text-gray-700">{pathway.description}</p>
        </Card>
      </header>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Pembelajaran</h3>
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${getVideoIdByPathwayId(pathway.id)}`}
              title="Video Pembelajaran"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </Card>

      {sections.map((section: any, index: number) => (
        <section key={index}>
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
            
            <div className="prose prose-sm max-w-none">
              {section.content.split("\n").map((line: string, i: number) => (
                <p key={i} className="text-gray-700 mb-2 whitespace-pre-wrap">
                  {line}
                </p>
              ))}
            </div>
          </Card>
        </section>
      ))}

      {pathway.id === 1 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Perbandingan Ikatan Kimia</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <img
              src="/images/ikatan-kimia.jpg"
              alt="Ilustrasi Ikatan Kimia"
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Tabel Perbandingan Ikatan Kimia
          </p>
        </Card>
      )}

      <nav className="flex gap-4 pt-6">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            Kembali
          </Button>
        </Link>
        <Button 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          onClick={handleComplete}
          disabled={isCompleting}
        >
          {isCompleting ? 'Menyimpan...' : 'Selesai'}
        </Button>
      </nav>
    </article>
  )
}
