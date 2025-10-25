"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AtomSelector } from "./atom-selector"
import { BondVisualizer } from "./bond-visualizer"
import { ResultsPanel } from "./results-panel"

interface BondResult {
  atom1: string
  atom2: string
  bondType: string
  electronegativityDiff: number
  bondStrength: number
  isCorrect: boolean
  score: number
}

const experimentInfo = {
  ionic: {
    title: "Ionic Bonding",
    description: "Explore electron transfer between atoms with different electronegativities",
    atoms: ["Na", "Cl", "K", "F", "Mg", "O"],
    threshold: 1.7,
  },
  covalent: {
    title: "Covalent Bonding",
    description: "Discover electron sharing between atoms with similar electronegativities",
    atoms: ["H", "C", "N", "O", "S", "P"],
    threshold: 0.4,
  },
  metallic: {
    title: "Metallic Bonding",
    description: "Understand the sea of electrons model in metals",
    atoms: ["Fe", "Cu", "Al", "Ag", "Au", "Zn"],
    threshold: 0.1,
  },
  hydrogen: {
    title: "Hydrogen Bonding",
    description: "Discover intermolecular forces between polar molecules",
    atoms: ["H", "N", "O", "F", "C", "S"],
    threshold: 0.5,
  },
}

const electronegativities: Record<string, number> = {
  H: 2.1,
  C: 2.55,
  N: 3.04,
  O: 3.44,
  F: 3.98,
  P: 2.19,
  S: 2.58,
  Cl: 3.16,
  Na: 0.93,
  K: 0.82,
  Mg: 1.31,
  Fe: 1.83,
  Cu: 1.9,
  Al: 1.61,
  Ag: 1.93,
  Au: 2.54,
  Zn: 1.65,
}

export default function LabSimulator({
  user,
  experimentType,
}: {
  user: User
  experimentType: string
}) {
  const [selectedAtom1, setSelectedAtom1] = useState<string | null>(null)
  const [selectedAtom2, setSelectedAtom2] = useState<string | null>(null)
  const [results, setResults] = useState<BondResult[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const supabase = createClient()

  const info = experimentInfo[experimentType as keyof typeof experimentInfo]

  useEffect(() => {
    const createSession = async () => {
      const { data } = await supabase
        .from("lab_sessions")
        .insert({
          user_id: user.id,
          title: `${info.title} Experiment`,
          description: `Interactive ${info.title} experiment`,
        })
        .select()
        .single()

      if (data) {
        setSessionId(data.id)
      }
    }

    createSession()
  }, [user.id, supabase, info.title])

  const calculateBond = () => {
    if (!selectedAtom1 || !selectedAtom2) return

    const en1 = electronegativities[selectedAtom1] || 0
    const en2 = electronegativities[selectedAtom2] || 0
    const diff = Math.abs(en1 - en2)

    let bondType = "Unknown"
    let isCorrect = false

    if (experimentType === "ionic" && diff >= info.threshold) {
      bondType = "Ionic"
      isCorrect = true
    } else if (experimentType === "covalent" && diff < 0.4) {
      bondType = "Covalent"
      isCorrect = true
    } else if (experimentType === "metallic") {
      bondType = "Metallic"
      isCorrect = true
    } else if (experimentType === "hydrogen") {
      bondType = "Hydrogen Bond"
      isCorrect = true
    }

    const bondStrength = Math.max(0, 100 - diff * 20)
    const score = isCorrect ? Math.round(bondStrength) : Math.round(bondStrength * 0.5)

    const result: BondResult = {
      atom1: selectedAtom1,
      atom2: selectedAtom2,
      bondType,
      electronegativityDiff: diff,
      bondStrength,
      isCorrect,
      score,
    }

    setResults([...results, result])

    if (sessionId) {
      supabase.from("lab_results").insert({
        session_id: sessionId,
        user_id: user.id,
        experiment_type: experimentType,
        atom1: selectedAtom1,
        atom2: selectedAtom2,
        bond_type: bondType,
        electronegativity_diff: diff,
        bond_strength: bondStrength,
        is_correct: isCorrect,
        score,
      })
    }

    setSelectedAtom1(null)
    setSelectedAtom2(null)
  }

  const totalScore = results.reduce((sum, r) => sum + r.score, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{info.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{info.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{totalScore}</p>
            <p className="text-sm text-gray-600">Total Score</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Atoms</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Atom 1</label>
                  <AtomSelector atoms={info.atoms} selected={selectedAtom1} onSelect={setSelectedAtom1} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Atom 2</label>
                  <AtomSelector atoms={info.atoms} selected={selectedAtom2} onSelect={setSelectedAtom2} />
                </div>
              </div>

              <Button
                onClick={calculateBond}
                disabled={!selectedAtom1 || !selectedAtom2}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-10"
              >
                Analyze Bond
              </Button>
            </Card>

            {selectedAtom1 && selectedAtom2 && <BondVisualizer atom1={selectedAtom1} atom2={selectedAtom2} />}
          </div>

          <div>
            <ResultsPanel results={results} experimentType={experimentType} />
          </div>
        </div>
      </main>
    </div>
  )
}
