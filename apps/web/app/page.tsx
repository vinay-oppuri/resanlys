"use client"

import { useTRPC } from "@workspace/trpc/client"
import { Button } from "@workspace/ui/components/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

const Home = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const trpc = useTRPC()
  const { data: helloData } = useQuery(trpc.hello.hello.queryOptions({ text: "from tRPC" }))

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center font-sans">
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="text-foreground">{helloData?.greeting}</p>
      <Button>Button</Button>
      <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  )
}
export default Home