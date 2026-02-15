import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import type { ReactNode } from "react"
import "../styles/globals.css"
import AppShell from "../components/AppShell"
import CreatorSection from "../components/CreatorSection"
import FooterCredit from "../components/FooterCredit"
import FloatingSignature from "../components/FloatingSignature"
import { ThemeProvider } from "../context/ThemeContext"

const headingFont = Sora({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Demon Slayer Character Vault",
  description: "Cinematic Demon Slayer character showcase",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <AppShell>
            {children}
            <CreatorSection />
            <FooterCredit />
          </AppShell>
        </ThemeProvider>
        <FloatingSignature />
      </body>
    </html>
  )
}
