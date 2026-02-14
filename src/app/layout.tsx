import type { Metadata } from "next"
import { Inter, Yuji_Boku } from "next/font/google"
import type { ReactNode } from "react"
import "../styles/globals.css"
import AppShell from "../components/AppShell"
import CreatorSection from "../components/CreatorSection"
import FooterCredit from "../components/FooterCredit"
import FloatingSignature from "../components/FloatingSignature"

const headingFont = Yuji_Boku({
  weight: "400",
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
        <AppShell>
          {children}
          <CreatorSection />
          <FooterCredit />
        </AppShell>
        <FloatingSignature />
      </body>
    </html>
  )
}
