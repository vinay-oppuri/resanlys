"use client"

import { Button } from "@workspace/ui/components/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Home = () => {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if(!mounted) return null

    return (
        <div className="flex flex-col gap-4 min-h-screen items-center justify-center font-sans">
            <h1 className="text-3xl font-bold">Home</h1>
            <Button>Button</Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
        </div>
    )
}
export default Home