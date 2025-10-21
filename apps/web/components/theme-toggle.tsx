"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@rumsan/shadcn"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleThemeChange}
      className="w-12 h-12 p-0"
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}