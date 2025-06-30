"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, TrendingUp, Search, ArrowRight, Sparkles, Zap, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const features = [
  {
    title: "AI Case Law Search",
    description:
      "Search across Supreme Court, High Courts, ITAT & Income Tax Department cases with intelligent filtering.",
    icon: Search,
    href: "/case-laws",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    count: "50,000+",
    features: ["Advanced semantic search", "Citation network analysis", "Real-time case updates", "Precedent tracking"],
  },
  {
    title: "Smart Document Hub",
    description: "Generate and manage legal documents with AI-powered assistance and intelligent suggestions.",
    icon: FileText,
    href: "/documents",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    count: "25+",
    features: ["Partnership deed generator", "HUF deed automation", "Reply letter templates", "Document analytics"],
  },
  {
    title: "Valuation Intelligence",
    description:
      "Professional property and asset valuation with AI-powered market analysis and comprehensive reporting.",
    icon: Scale,
    href: "/valuation",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    count: "500+",
    features: ["Property valuation", "Asset assessment", "Market analysis", "Compliance reports"],
  },
]

const stats = [
  { label: "Active Users", value: "10,000+", change: "+15%" },
  { label: "Documents Processed", value: "1M+", change: "+25%" },
  { label: "Cases Searched", value: "500K+", change: "+30%" },
  { label: "Forms Generated", value: "100K+", change: "+20%" },
]

export function DashboardView() {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <Badge variant="outline" className="mb-4">
          <Sparkles className="mr-2 h-4 w-4" />
          Professional Legal Document Management
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to E-Library
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
          Professional legal document management with real-time case law search, AI-powered document generation, and
          comprehensive valuation reports.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
                <div className="flex items-center justify-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center">Comprehensive Legal Solutions</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 ${feature.bgColor} opacity-50`} />
              <CardContent className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {feature.count}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(feature.title)}
                      className="p-1 h-8 w-8"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(feature.title) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

                <ul className="space-y-2 mb-6">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-3 text-yellow-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
