"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface FinalTestViewProps {
  pathway: {
    id: number
    title: string
    description: string
    order_number: number
    type: string
    content: any
  }
  user: User
}

export default function FinalTestView({ pathway, user }: FinalTestViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const questions = pathway.content?.questions || []

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    let correctCount = 0
    questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correct_answer) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const userAnswer = answers[i]
      const isCorrect = userAnswer === question.correct_answer

      await supabase
        .from("quiz_answers")
        .delete()
        .eq("pathway_id", pathway.id)
        .eq("user_id", user.id)
        .eq("question_id", question.id)

      await supabase
        .from("quiz_answers")
        .insert({
          pathway_id: pathway.id,
          user_id: user.id,
          question_id: question.id,
          user_answer: userAnswer,
          correct_answer: question.correct_answer,
          is_correct: isCorrect,
          explanation: question.explanation || ""
        })
    }

    await supabase
      .from("user_pathway_progress")
      .update({ score: finalScore, status: "completed" })
      .eq("pathway_id", pathway.id)
      .eq("user_id", user.id)
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      console.log('[Client] Completing pathway:', pathway.id)
      
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathwayId: pathway.id,
          status: 'completed',
          score: score
        })
      })

      const data = await response.json()
      console.log('[Client] API Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyelesaikan pembelajaran')
      }

      if (data.nextPathwayId) {
        console.log('[Client] Going to next pathway:', data.nextPathwayId)
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

  if (showResults) {
    const correctCount = answers.filter((a, i) => a === questions[i]?.correct_answer).length

    return (
      <article className="space-y-6">
        <header>
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hasil Tes Akhir</h2>
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">{score}%</div>
              <p className="text-lg text-gray-700 mb-2">
                Anda menjawab {correctCount} dari {questions.length} pertanyaan dengan benar
              </p>
              <p className="text-gray-600">
                {score >= 80
                  ? "Selamat! Anda telah menguasai materi Chemical Bonding dengan baik."
                  : score >= 60
                    ? "Bagus! Anda sudah memahami sebagian besar materi. Pelajari kembali bagian yang kurang."
                    : "Anda perlu mempelajari kembali materi Chemical Bonding."}
              </p>
            </div>
          </Card>
        </header>

        <nav>
          <Link href="/dashboard" className="block mb-4">
            <Button variant="outline" className="w-full bg-transparent">
              Kembali
            </Button>
          </Link>
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? 'Menyimpan...' : 'Selesai'}
          </Button>
        </nav>
      </article>
    )
  }

  const question = questions[currentQuestion]

  return (
    <article className="space-y-6">
      <header>
        <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{pathway.title}</h2>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700">
              Pertanyaan {currentQuestion + 1} dari {questions.length}
            </p>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </header>

      <section>
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{question?.question}</h3>

          <div className="space-y-3 mb-6">
            {question?.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index ? "border-purple-600 bg-purple-600" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <nav className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Sebelumnya
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNext} className="flex-1 bg-purple-600 hover:bg-purple-700">
              Selanjutnya
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              Selesai & Lihat Hasil
            </Button>
          )}
          </nav>
        </Card>
      </section>
    </article>
  )
}
