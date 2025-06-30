"use client"

import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, LogOut, Sun, Moon, Bell, Settings } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Library
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">by iTax Easy</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {user && (
            <Badge variant="secondary" className="hidden sm:flex">
              <User className="w-3 h-3 mr-1" />
              {user.name} ({user.role})
            </Badge>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
