"use client"

type BackgroundFXProps = {
  primary: string
  secondary: string
}

export default function BackgroundFX({ primary, secondary }: BackgroundFXProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05), transparent 40%)",
        }}
      />
      <div
        className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-blob float-slow"
        style={{ background: `radial-gradient(circle, ${primary}, transparent 65%)` }}
      />
      <div
        className="absolute bottom-[-120px] right-[10%] h-[520px] w-[520px] rounded-full bg-blob float-slower"
        style={{ background: `radial-gradient(circle, ${secondary}, transparent 65%)` }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          animation: "fadeUp 6s ease-in-out infinite alternate",
        }}
      />
    </div>
  )
}
