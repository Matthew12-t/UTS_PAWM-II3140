"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface QuizDetailModalProps {
  isOpen: boolean
  onClose: () => void
  pathwayId: number
  user: User
  pathwayTitle: string
}

interface QuizAnswer {
  question_id: number
  user_answer: number
  correct_answer: number
  is_correct: boolean
  explanation: string
  question_text: string
  options: string[]
}

export function QuizDetailModal({ isOpen, onClose, pathwayId, user, pathwayTitle }: QuizDetailModalProps) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen) return

    const fetchAnswers = async () => {
      setLoading(true)

      const { data: pathwayData } = await supabase.from("pathways").select("content").eq("id", pathwayId).single()

      const { data: answersData } = await supabase
        .from("quiz_answers")
        .select("*")
        .eq("pathway_id", pathwayId)
        .eq("user_id", user.id)

      if (pathwayData && answersData) {
        const questions = pathwayData.content?.questions || []
        const formattedAnswers = answersData.map((answer: any) => {
          const question = questions.find((q: any) => q.id === answer.question_id)
          return {
            question_id: answer.question_id,
            user_answer: answer.user_answer,
            correct_answer: answer.correct_answer,
            is_correct: answer.is_correct,
            explanation: answer.explanation,
            question_text: question?.question || "Pertanyaan tidak ditemukan",
            options: question?.options || [],
          }
        })
        setAnswers(formattedAnswers)
      }

      setLoading(false)
    }

    fetchAnswers()
  }, [isOpen, pathwayId, user.id, supabase])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">{pathwayTitle}</h2>
          <p className="text-indigo-100">Pembahasan Jawaban Anda</p>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <p className="text-center text-gray-600">Memuat pembahasan...</p>
          ) : answers.length === 0 ? (
            <p className="text-center text-gray-600">Tidak ada jawaban yang ditemukan</p>
          ) : (
            answers.map((answer, index) => (
              <div key={answer.question_id} className="border-l-4 border-indigo-500 pl-4 py-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex-1">
                    Pertanyaan {index + 1}: {answer.question_text}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      answer.is_correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {answer.is_correct ? "✓ Benar" : "✗ Salah"}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Jawaban Anda:</p>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-gray-900">{answer.options[answer.user_answer]}</p>
                    </div>
                  </div>

                  {!answer.is_correct && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Jawaban yang Benar:</p>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-gray-900">{answer.options[answer.correct_answer]}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Pembahasan:</p>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-900">{answer.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex justify-end gap-3">
          <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  )
}
