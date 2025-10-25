export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">⚛️</div>
      <div className="absolute top-32 right-20 text-5xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}>
        🧪
      </div>
      <div className="absolute bottom-32 left-20 text-6xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}>
        🔬
      </div>
      <div className="absolute bottom-20 right-32 text-5xl opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}>
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
  )
}
