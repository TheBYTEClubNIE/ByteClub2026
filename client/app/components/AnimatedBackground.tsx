"use client";

export default function StaticSpaceBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020617]">
      
      {/* Main Space Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0,140,255,0.18), transparent 28%),
            radial-gradient(circle at 80% 20%, rgba(0,212,255,0.12), transparent 30%),
            radial-gradient(circle at 70% 75%, rgba(0,100,255,0.14), transparent 35%),
            radial-gradient(circle at 30% 80%, rgba(0,180,255,0.10), transparent 25%),
            linear-gradient(to bottom, #020617, #031633, #020617)
          `,
          filter: "blur(8px)",
          transform: "scale(1.05)",
        }}
      />

      {/* Tiny Stars */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1.5px 1.5px at 120px 80px, rgba(0,212,255,0.8), transparent),
            radial-gradient(2px 2px at 220px 180px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 320px 120px, rgba(0,212,255,0.7), transparent),
            radial-gradient(2px 2px at 520px 220px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 720px 320px, rgba(0,212,255,0.6), transparent)
          `,
          backgroundSize: "800px 800px",
          opacity: 0.45,
        }}
      />

      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,6,23,0.2), rgba(2,6,23,0.5))",
        }}
      />
    </div>
  );
}