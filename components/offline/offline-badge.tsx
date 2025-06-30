"use client"

import { useOfflineStatus } from "@/hooks/use-offline-status"
import { WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function OfflineBadge() {
  const isOffline = useOfflineStatus()

  if (!isOffline) {
    return null
  }

  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
      <WifiOff className="h-3 w-3" />
      <span className="text-xs">Offline</span>
    </Badge>
  )
}
