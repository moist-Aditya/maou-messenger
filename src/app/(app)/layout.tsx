import { Inter } from "next/font/google"
import "../globals.css"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <div className="mt-28 max-w-7xl mx-auto">{children}</div>
      </body>
    </html>
  )
}
