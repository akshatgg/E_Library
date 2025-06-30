"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FolderOpen, Heart, TrendingUp } from "lucide-react"
import { useAppContext } from "@/lib/app-context"

export function StatsCards() {
  const { state } = useAppContext()

  const stats = [
    {
      title: "Total Documents",
      value: state.stats.totalEntries,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Categories",
      value: state.stats.totalCategories,
      icon: FolderOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Favorites",
      value: state.stats.favorites,
      icon: Heart,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      change: "+5",
      changeType: "positive" as const,
    },
    {
      title: "Recently Added",
      value: state.stats.recentlyAdded,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      change: "+8",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      stat.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
