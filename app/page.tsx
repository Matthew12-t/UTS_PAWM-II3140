import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">⚛️</div>
        <div className="absolute top-32 right-20 text-5xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}>
          🧪
        </div>
        <div className="absolute bottom-32 left-20 text-6xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}>
          🔬
        </div>
        <div
          className="absolute bottom-20 right-32 text-5xl opacity-10 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        >
          ⚗️
        </div>
        <div className="absolute top-1/2 left-1/3 text-7xl opacity-5 animate-pulse" style={{ animationDelay: "0.5s" }}>
          🧬
        </div>

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">⚛️</span>
            <h1 className="text-2xl font-bold text-white">ChemLab</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-4 mb-6 text-5xl">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>
                ⚛️
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                🧪
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                🔬
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
              Learn Chemistry Through Interactive Experiments
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto text-balance">
              Master chemical bonding with our virtual lab. Explore ionic, covalent, metallic, and hydrogen bonding
              through hands-on simulations and interactive learning.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Start Learning Now
              </Button>
            </Link>
          </div>

          <section className="bg-white/10 backdrop-blur-md rounded-lg p-12 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Choose ChemLab?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="text-center">
                <div className="text-5xl mb-3">🎯</div>
                <h4 className="font-semibold text-white mb-2">Interactive Learning</h4>
                <p className="text-indigo-100">
                  Engage with chemistry through hands-on virtual experiments and simulations
                </p>
              </article>
              <article className="text-center">
                <div className="text-5xl mb-3">📊</div>
                <h4 className="font-semibold text-white mb-2">Track Progress</h4>
                <p className="text-indigo-100">
                  Monitor your learning journey with detailed analytics and performance metrics
                </p>
              </article>
              <article className="text-center">
                <div className="text-5xl mb-3">🏆</div>
                <h4 className="font-semibold text-white mb-2">Earn Scores</h4>
                <p className="text-indigo-100">Get instant feedback and build your chemistry knowledge with quizzes</p>
              </article>
            </div>
          </section>
        </section>
      </main>

      <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-white font-semibold">ChemLab - Virtual Chemistry Laboratory</p>
          <p className="text-indigo-200 text-sm mt-2">
            Learn chemistry through interactive experiments and simulations
          </p>
        </div>
      </footer>
    </div>
  )
}