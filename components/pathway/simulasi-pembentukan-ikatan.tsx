"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface SimulasiPembentukanIkatanProps {
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

export default function SimulasiPembentukanIkatan({
  pathway,
  user,
}: SimulasiPembentukanIkatanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Overall interaction: …");
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 1280,
      H = 720;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const parentWidth = canvas.parentElement!.clientWidth;
      const parentHeight = canvas.parentElement!.clientHeight - 2;
      W = parentWidth;
      H = parentHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", fit, { passive: true });
    fit();

    const atomR = 16;
    const EPSILON = 1.0;
    const COULOMB_K = 40000;
    const bias = 140;
    const model = "LJ";

    const midY = H * 0.5;
    const a1 = { x: W * 0.4, y: midY, r: atomR, dragging: false };
    const a2 = { x: W * 0.6, y: midY, r: atomR, dragging: false };

    function forceLJ(r: number) {
      const sOverR = bias / r;
      const s6 = sOverR ** 6;
      const s12 = s6 * s6;
      return 24 * EPSILON * (2 * s12 / r - s6 / r);
    }

    function forceCoulomb(r: number) {
      const rep = COULOMB_K / (r * r);
      const att = (COULOMB_K * 0.65) / (r * r * r);
      return rep - att;
    }

    function computeForce() {
      const dx = a2.x - a1.x,
        dy = a2.y - a1.y;
      const r = Math.hypot(dx, dy);
      const dir = { x: dx / r, y: dy / r };
      const Fmag = model === "LJ" ? forceLJ(r) : forceCoulomb(r);
      return { F1: { x: -Fmag * dir.x, y: -Fmag * dir.y }, F2: { x: Fmag * dir.x, y: -Fmag * dir.y }, mag: Fmag, r };
    }

    const pointer = { down: false, target: null as any, ox: 0 };

    const hit = (x: number, y: number, d: any) =>
      (x - d.x) ** 2 + (y - d.y) ** 2 <= (d.r + 8) ** 2;

    canvas.addEventListener("pointerdown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (hit(x, y, a1)) {
        pointer.down = true;
        pointer.target = a1;
        pointer.ox = x - a1.x;
      } else if (hit(x, y, a2)) {
        pointer.down = true;
        pointer.target = a2;
        pointer.ox = x - a2.x;
      }
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!pointer.down || !pointer.target) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      pointer.target.x = Math.max(30, Math.min(W - 30, x - pointer.ox));
      pointer.target.y = midY; 
    });

    const stopDrag = () => {
      pointer.down = false;
      pointer.target = null;
    };
    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointerleave", stopDrag);

    const drawNucleus = ({ x, y, r }: any, color = "#1845ff") => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      const g = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, r + 10);
      g.addColorStop(0, "rgba(255,255,255,.6)");
      g.addColorStop(1, color);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawArrow = (x: number, y: number, vx: number, vy: number) => {
      const L = Math.min(80, Math.max(18, Math.hypot(vx, vy) * 160));
      const a = Math.atan2(vy, vx);
      ctx.strokeStyle = "#ffea00";
      ctx.fillStyle = "#ffea00";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
      ctx.stroke();
      const hx = x + Math.cos(a) * L,
        hy = y + Math.sin(a) * L;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - 10 * Math.cos(a - Math.PI / 6), hy - 10 * Math.sin(a - Math.PI / 6));
      ctx.lineTo(hx - 10 * Math.cos(a + Math.PI / 6), hy - 10 * Math.sin(a + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    const drawElectronCloud = () => {
      const dx = a2.x - a1.x;
      const dist = Math.abs(dx);
      const overlapFactor = Math.max(0, 1 - dist / 300); 

      ctx.globalCompositeOperation = "lighter";

      const drawCloud = (x: number, y: number, intensity: number) => {
        const radius = 120 + intensity * 80;
        const grd = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
        grd.addColorStop(0, `rgba(255,0,0,${0.5 + 0.4 * intensity})`);
        grd.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCloud(a1.x, a1.y, 1 - overlapFactor * 0.5);
      drawCloud(a2.x, a2.y, 1 - overlapFactor * 0.5);

      if (overlapFactor > 0.2) {
        const midX = (a1.x + a2.x) / 2;
        const midY = a1.y;
        const radius = 160 * overlapFactor + 60;
        const grd = ctx.createRadialGradient(midX, midY, 0, midX, midY, radius);
        grd.addColorStop(0, `rgba(255,0,0,${0.4 + overlapFactor * 0.5})`);
        grd.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(midX, midY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const frame = () => {
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "rgba(0,0,0,1)");
      bg.addColorStop(1, "rgba(0,0,0,.9)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawElectronCloud();

      const F = computeForce();
      drawNucleus(a1);
      drawNucleus(a2);
      drawArrow(a1.x, a1.y, F.F1.x, F.F1.y);
      drawArrow(a2.x, a2.y, F.F2.x, F.F2.y);

      const kind = Math.abs(F.mag) < 0.002 ? "Neutral" : F.mag > 0 ? "Repulsive" : "Attractive";
      setStatus(`Overall interaction: ${kind}`);

      requestAnimationFrame(frame);
    };
    frame();

    return () => window.removeEventListener("resize", fit);
  }, []);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathwayId: pathway.id, status: "completed" }),
      });
      const data = await response.json();
      if (data.nextPathwayId) {
        router.push(`/pathway/${data.nextPathwayId}`);
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const interactionText = status.replace("Overall interaction:", "").trim();

  return (
    <article className="space-y-6">
      <div
        style={{
          position: "relative",
          height: "70vh",
          background: "#000",
          border: "1px solid #333",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            background: "#061a1a",
            borderBottom: "2px solid #00e0c6",
            padding: "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <h1 style={{ fontSize: "1rem", margin: 0, color: "#cfe" }}>
            Pembentukkan Ikatan Kimia
          </h1>
          <span style={{ opacity: 0.35 }}>•</span>
          <button
            onClick={() => window.location.reload()}
            style={{
              border: "1px solid #1c9",
              background: "#072",
              color: "#dff",
              padding: ".35rem .65rem",
              borderRadius: ".6rem",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </header>

        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />

        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: "bold",
            fontSize: "1.8rem",
            color:
              interactionText === "Attractive"
                ? "lightgreen"
                : interactionText === "Repulsive"
                ? "orange"
                : "gray",
            textShadow: "0 0 10px rgba(255,255,255,0.3)",
          }}
        >
          Overall interaction: {interactionText}
        </div>
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
