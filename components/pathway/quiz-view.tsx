"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface QuizViewProps {
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

export default function QuizView({ pathway, user }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const questions = pathway.content?.questions || []

  const quizExplanations: { [key: string]: { [key: number]: string } } = {
    "Topik 1: Jenis dan Mekanisme Ikatan Kimia": {
      0: "Ikatan ionik terbentuk melalui transfer elektron dari atom logam ke atom nonlogam. Atom yang kehilangan elektron menjadi kation (bermuatan positif) dan atom yang menerima elektron menjadi anion (bermuatan negatif). Gaya tarik elektrostatik antara kedua ion ini membentuk ikatan ionik yang kuat.",
      1: "Ikatan kovalen terbentuk ketika dua atom berbagi pasangan elektron. Elektron dari kedua atom saling tumpang tindih membentuk orbital molekul. Ikatan kovalen dapat berupa tunggal (satu pasang elektron), ganda (dua pasang elektron), atau rangkap tiga (tiga pasang elektron).",
      2: "Ikatan logam terbentuk ketika elektron valensi dari atom-atom logam bergerak bebas membentuk 'laut elektron' yang mengelilingi kation-kation logam. Elektron-elektron ini tidak terikat pada atom tertentu dan dapat bergerak dengan mudah, yang menjelaskan mengapa logam memiliki konduktivitas listrik yang baik.",
    },
    "Topik 2: Struktur, Sifat, dan Penamaan Senyawa": {
      0: "Senyawa ionik memiliki struktur kristal yang teratur dengan ion-ion tersusun dalam pola 3D yang berulang. Struktur ini menghasilkan sifat-sifat khas seperti titik leleh tinggi, kelarutan dalam pelarut polar seperti air, dan kemampuan menghantarkan listrik dalam keadaan cair atau larutan.",
      1: "Senyawa kovalen dapat berupa molekul diskrit atau jaringan kovalen. Senyawa kovalen molekuler memiliki titik leleh rendah karena gaya antar molekul lemah, sedangkan jaringan kovalen memiliki titik leleh sangat tinggi karena seluruh struktur terikat oleh ikatan kovalen yang kuat.",
      2: "Penamaan senyawa ionik mengikuti aturan: nama kation diikuti nama anion dengan akhiran -ida. Contoh: NaCl (natrium klorida), CaCO₃ (kalsium karbonat). Untuk kation dengan muatan variabel, gunakan angka Romawi dalam tanda kurung untuk menunjukkan muatannya.",
    },
  }

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

    const answerPromises = questions.map(async (q: any, index: number) => {
      const isCorrect = answers[index] === q.correct_answer
      if (isCorrect) correctCount++

      const explanations = quizExplanations[pathway.title] || {}
      const baseExplanation = explanations[q.correct_answer] || q.explanation || "Silakan pelajari kembali materi ini."

      const explanation = isCorrect
        ? `✓ Jawaban Anda benar!\n\n${baseExplanation}`
        : `✗ Jawaban Anda salah.\n\nJawaban yang benar adalah: ${q.options[q.correct_answer]}\n\n${baseExplanation}`

      await supabase.from("quiz_answers").insert({
        user_id: user.id,
        pathway_id: pathway.id,
        question_id: q.id,
        user_answer: answers[index] ?? -1,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: explanation,
      })
    })

    await Promise.all(answerPromises)

    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)

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
    return (
      <article className="space-y-6">
        <header>
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hasil Kuis</h2>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">{score}%</div>
              <p className="text-lg text-gray-700">
                Anda menjawab {answers.filter((a, i) => a === questions[i]?.correct_answer).length} dari{" "}
                {questions.length} pertanyaan dengan benar
              </p>
            </div>
          </Card>
        </header>

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

  const question = questions[currentQuestion]

  return (
    <article className="space-y-6">
      <header>
        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{pathway.title}</h2>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700">
              Pertanyaan {currentQuestion + 1} dari {questions.length}
            </p>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all"
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
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
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
              <Button onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
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
