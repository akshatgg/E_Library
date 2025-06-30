"use client"

import { useOffline } from "@/hooks/use-offline"
import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function OfflineStatus() {
  const isOffline = useOffline()

  if (!isOffline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <Wifi className="h-3 w-3" />
              <span className="text-xs">Online</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>You are connected to the internet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
            <WifiOff className="h-3 w-3" />
            <span className="text-xs">Offline</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>You are currently offline. Some features may be limited.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
