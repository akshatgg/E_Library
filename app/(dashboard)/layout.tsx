import type React from "react"
import { SubscriptionProvider } from "@/lib/subscription-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SubscriptionProvider>{children}</SubscriptionProvider>
}
