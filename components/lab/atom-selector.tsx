"use client"

import { Button } from "@/components/ui/button"

interface AtomSelectorProps {
  atoms: string[]
  selected: string | null
  onSelect: (atom: string) => void
}

export function AtomSelector({ atoms, selected, onSelect }: AtomSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {atoms.map((atom) => (
        <Button
          key={atom}
          onClick={() => onSelect(atom)}
          variant={selected === atom ? "default" : "outline"}
          className={`h-12 text-lg font-semibold ${
            selected === atom ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "hover:bg-slate-100"
          }`}
        >
          {atom}
        </Button>
      ))}
    </div>
  )
}
