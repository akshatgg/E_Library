"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <Badge variant="destructive" className="flex items-center gap-1">
      <WifiOff className="h-3 w-3" />
      Offline
    </Badge>
  )
}

export function OnlineStatusBadge() {
  const isOnline = useOnlineStatus()

  return (
    <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
      {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      {isOnline ? "Online" : "Offline"}
    </Badge>
  )
}
