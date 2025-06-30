"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

interface BackButtonProps {
  href?: string
  label?: string
  variant?: "default" | "outline" | "ghost"
  className?: string
  showHome?: boolean
}

export function BackButton({
  href,
  label = "Back",
  variant = "ghost",
  className = "",
  showHome = true,
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant={variant} onClick={handleBack} className={`flex items-center space-x-2 ${className}`}>
        <ArrowLeft className="h-4 w-4" />
        <span>{label}</span>
      </Button>
      {showHome && (
        <Button variant="outline" onClick={handleHome} className="flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
      )}
    </div>
  )
}
