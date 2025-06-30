"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Scale,
  BookOpen,
  Calculator,
  Building,
  TrendingUp,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  Moon,
  Sun,
  LogOut,
  User,
} from "lucide-react"
import Link from "next/link"

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

const quickActions = [
  { name: "Partnership Deed", icon: Users, href: "/forms/partnership" },
  { name: "HUF Deed", icon: Users, href: "/forms/huf" },
  { name: "Reply Letter", icon: FileText, href: "/forms/reply" },
  { name: "Wealth Certificate", icon: Calculator, href: "/forms/wealth" },
  { name: "Valuation Report", icon: Building, href: "/valuation/new" },
  { name: "Case Search", icon: Scale, href: "/case-laws/search" },
]

const stats = [
  { label: "Active Users", value: "10,000+", change: "+15%" },
  { label: "Documents Processed", value: "1M+", change: "+25%" },
  { label: "Cases Searched", value: "500K+", change: "+30%" },
  { label: "Forms Generated", value: "100K+", change: "+20%" },
]

export function HomePage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">E-Library</h1>
              <p className="text-sm text-muted-foreground">by iTax Easy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session && (
              <Badge variant="secondary" className="hidden sm:flex">
                <User className="w-3 h-3 mr-1" />
                {session.user?.name}
              </Badge>
            )}

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {session ? (
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signin">Start Free Trial</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="container">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              Professional Legal Document Management
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                E-Library
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Professional legal document management with real-time case law search, AI-powered document generation, and
              comprehensive valuation reports.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/case-laws">
                  <Search className="mr-2 h-5 w-5" />
                  Search Case Laws
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/documents">
                  <FileText className="mr-2 h-5 w-5" />
                  Manage Documents
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
                <div className="flex items-center justify-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Legal Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need for professional legal document management and case law research
            </p>
          </div>

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

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
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
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Quick Actions</h2>
            <p className="text-muted-foreground mt-2">Frequently used tools and forms</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <Link href={action.href}>
                  <CardContent className="p-6 text-center">
                    <action.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">{action.name}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">E-Library</h3>
                  <p className="text-sm text-muted-foreground">by iTax Easy</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional legal document management for tax practitioners and legal professionals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/case-laws" className="hover:text-foreground">
                    Case Law Search
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="hover:text-foreground">
                    Document Generation
                  </Link>
                </li>
                <li>
                  <Link href="/valuation" className="hover:text-foreground">
                    Valuation Reports
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-foreground">
                    Legal Library
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-foreground">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>elibrary@itaxeasy.com</li>
                <li>
                  <Link href="/support" className="hover:text-foreground">
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>Copyright © 2025 iTax Easy Private Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
