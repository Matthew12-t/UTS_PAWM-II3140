"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface SimulationViewProps {
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

export default function SimulationView({ pathway, user }: SimulationViewProps) {
  const [selectedAtom1, setSelectedAtom1] = useState<string>("")
  const [selectedAtom2, setSelectedAtom2] = useState<string>("")
  const [result, setResult] = useState<any>(null)
  const supabase = createClient()

  const atoms = [
    { symbol: "H", name: "Hydrogen", electronegativity: 2.1 },
    { symbol: "C", name: "Carbon", electronegativity: 2.55 },
    { symbol: "N", name: "Nitrogen", electronegativity: 3.04 },
    { symbol: "O", name: "Oxygen", electronegativity: 3.44 },
    { symbol: "Na", name: "Sodium", electronegativity: 0.93 },
    { symbol: "Cl", name: "Chlorine", electronegativity: 3.16 },
    { symbol: "Mg", name: "Magnesium", electronegativity: 1.31 },
    { symbol: "S", name: "Sulfur", electronegativity: 2.58 },
  ]

  const determineBondType = (diff: number) => {
    if (diff < 0.4) return "Covalent Nonpolar"
    if (diff < 1.7) return "Covalent Polar"
    return "Ionic"
  }

  const handleSimulate = async () => {
    if (!selectedAtom1 || !selectedAtom2) return

    const atom1 = atoms.find((a) => a.symbol === selectedAtom1)
    const atom2 = atoms.find((a) => a.symbol === selectedAtom2)

    if (!atom1 || !atom2) return

    const diff = Math.abs(atom1.electronegativity - atom2.electronegativity)
    const bondType = determineBondType(diff)
    const energy = Math.random() * 500 + 100 // Simulated energy

    const simulationResult = {
      atom1: atom1.symbol,
      atom2: atom2.symbol,
      electronegativityDiff: diff.toFixed(2),
      bondType,
      energy: energy.toFixed(1),
    }

    setResult(simulationResult)

    // Save result
    await supabase.from("lab_results").insert({
      user_id: user.id,
      session_id: pathway.id,
      atom1: atom1.symbol,
      atom2: atom2.symbol,
      electronegativity_diff: diff,
      bond_type: bondType,
      bond_strength: energy,
      is_correct: true,
      score: 10,
    })
  }

  return (
    <article className="space-y-6">
      <header>
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{pathway.title}</h2>
          <p className="text-lg text-gray-700">{pathway.content?.instructions}</p>
        </Card>
      </header>

      <section>
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Pilih Dua Atom</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Atom Pertama</label>
            <select
              value={selectedAtom1}
              onChange={(e) => setSelectedAtom1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Pilih atom...</option>
              {atoms.map((atom) => (
                <option key={atom.symbol} value={atom.symbol}>
                  {atom.name} ({atom.symbol}) - EN: {atom.electronegativity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Atom Kedua</label>
            <select
              value={selectedAtom2}
              onChange={(e) => setSelectedAtom2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Pilih atom...</option>
              {atoms.map((atom) => (
                <option key={atom.symbol} value={atom.symbol}>
                  {atom.name} ({atom.symbol}) - EN: {atom.electronegativity}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleSimulate} className="w-full bg-indigo-600 hover:bg-indigo-700 mb-6">
          Simulasikan Pembentukan Ikatan
        </Button>

        {result && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Hasil Simulasi</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Atom 1:</span>
                <span className="font-semibold text-gray-900">{result.atom1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Atom 2:</span>
                <span className="font-semibold text-gray-900">{result.atom2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Perbedaan Elektronegativitas:</span>
                <span className="font-semibold text-gray-900">{result.electronegativityDiff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Jenis Ikatan:</span>
                <span className="font-semibold text-indigo-600">{result.bondType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Energi Ikatan:</span>
                <span className="font-semibold text-gray-900">{result.energy} kJ/mol</span>
              </div>
            </div>
          </div>
        )}
        </Card>
      </section>

      <nav className="flex gap-4 pt-6">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            Kembali
          </Button>
        </Link>
        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">Lanjut ke Kuis</Button>
      </nav>
    </article>
  )
}
