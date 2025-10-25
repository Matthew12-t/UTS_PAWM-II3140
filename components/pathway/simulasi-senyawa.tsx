"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface SimulasiSenyawaProps {
  pathway: {
    id: number;
    title: string;
    description: string;
    order_number: number;
    type: string;
    content: any;
  };
  user: User;
}

export default function SimulasiSenyawa({ pathway, user }: SimulasiSenyawaProps) {
  const [leftElement, setLeftElement] = useState("Hydrogen");
  const [rightElement, setRightElement] = useState("Oxygen");
  const [distance, setDistance] = useState(260);
  const [interaction, setInteraction] = useState("Attractive");
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const elementColors: Record<string, string> = {
    Hydrogen: "#a0d8ef",
    Oxygen: "#ff7f7f",
    Carbon: "#a8a8a8",
  };

  const elementSizes: Record<string, number> = {
    Hydrogen: 100,
    Oxygen: 140,
    Carbon: 180,
  };

  const radii = useMemo(() => {
    const rL = elementSizes[leftElement] / 2;
    const rR = elementSizes[rightElement] / 2;
    return { rL, rR };
  }, [leftElement, rightElement]);

  const thresholds = useMemo(() => {
    const buffer = 10;
    const repulsiveD = radii.rL + radii.rR + buffer; 
    const noInteractionD = repulsiveD * 2.6;
    return { repulsiveD, noInteractionD };
  }, [radii]);

  const classify = (d: number) => {
    if (d < thresholds.repulsiveD) return "Repulsive";
    if (d > thresholds.noInteractionD) return "No Interaction";
    return "Attractive";
  };

  useEffect(() => {
    const minD = thresholds.repulsiveD * 0.9;
    const maxD = thresholds.noInteractionD * 1.1;
    const clamped = Math.min(maxD, Math.max(minD, distance));
    setDistance(clamped);
    setInteraction(classify(clamped));
  }, [leftElement, rightElement, thresholds.repulsiveD, thresholds.noInteractionD]);

  const handleMove = (delta: number) => {
    let newDist = distance + delta;
    const minD = thresholds.repulsiveD * 0.8;
    const maxD = thresholds.noInteractionD * 1.3;
    newDist = Math.min(maxD, Math.max(minD, newDist));
    setDistance(newDist);
    setInteraction(classify(newDist));
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathwayId: pathway.id,
          status: "completed",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyelesaikan pembelajaran");
      if (data.nextPathwayId) {
        router.push(`/pathway/${data.nextPathwayId}`);
        router.refresh();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("[Client] Error:", error);
      alert(
        `Gagal menyelesaikan pembelajaran: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <article className="space-y-6 mt-6">
      <div className="flex gap-6 items-stretch min-h-[400px]">
        <section className="bg-white rounded-lg shadow-xl p-4 w-[120px] h-[350px] flex flex-col items-center">
          <h3 className="text-xs font-semibold text-gray-800 mb-3 text-center">
            Potential Energy
          </h3>
          <div className="flex-1 w-12 bg-gradient-to-t from-green-500 to-green-200 rounded-lg relative">
            <div
              className="absolute w-full bg-red-500 transition-all duration-300"
              style={{
                height: `${Math.max(
                  0,
                  Math.min(
                    100,
                    ((thresholds.noInteractionD - distance) /
                      (thresholds.noInteractionD - thresholds.repulsiveD)) *
                      100
                  )
                )}%`,
                bottom: 0,
                borderRadius: "0 0 0.5rem 0.5rem",
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">Energy Level</p>
        </section>

        <section className="relative bg-black rounded-lg shadow-xl w-[550px] h-[380px] overflow-hidden flex flex-col items-center justify-center">
          <motion.div
            animate={{ x: -distance / 2 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="absolute flex items-center justify-center rounded-full border border-black shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            style={{
              width: elementSizes[leftElement],
              height: elementSizes[leftElement],
              background: elementColors[leftElement],
            }}
          >
            <span className="text-black text-4xl font-bold">
              {leftElement[0]}
            </span>
          </motion.div>

          <motion.div
            animate={{ x: distance / 2 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="absolute flex items-center justify-center rounded-full border border-black shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            style={{
              width: elementSizes[rightElement],
              height: elementSizes[rightElement],
              background: elementColors[rightElement],
            }}
          >
            <span className="text-black text-4xl font-bold">
              {rightElement[0]}
            </span>
          </motion.div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-yellow-300 text-sm mb-1">Overall interaction:</p>
            <p
              className={`font-bold text-2xl ${
                interaction === "Attractive"
                  ? "text-green-400"
                  : interaction === "Repulsive"
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              {interaction}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-xl p-6 w-[260px] h-[300px] flex flex-col gap-4 mt-7">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Left Element
            </h3>
            <select
              value={leftElement}
              onChange={(e) => setLeftElement(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option>Hydrogen</option>
              <option>Oxygen</option>
              <option>Carbon</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Right Element
            </h3>
            <select
              value={rightElement}
              onChange={(e) => setRightElement(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option>Hydrogen</option>
              <option>Oxygen</option>
              <option>Carbon</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Distance
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleMove(-20)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium"
              >
                Move Closer
              </button>
              <button
                onClick={() => handleMove(20)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium"
              >
                Move Apart
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              {Math.round(distance)} px
            </p>
          </div>
        </section>
      </div>

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
          {isCompleting ? "Menyimpan..." : "Selesai"}
        </Button>
      </nav>
    </article>
  );
}
