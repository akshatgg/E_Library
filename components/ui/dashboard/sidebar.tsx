"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Scale,
  FileText,
  Building,
  BookOpen,
  Settings,
  Users,
  Calculator,
  Search,
  Upload,
  Camera,
  TrendingUp,
  Star,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Case Laws", href: "/case-laws", icon: Scale, badge: "50K+" },
  { name: "Documents", href: "/documents", icon: FileText, badge: "New" },
  { name: "Valuation", href: "/valuation", icon: Building, badge: null },
  { name: "Library", href: "/library", icon: BookOpen, badge: null },
  { name: "Forms", href: "/forms", icon: Users, badge: "25+" },
  { name: "OCR Scanner", href: "/scanner", icon: Camera, badge: "AI" },
  { name: "Calculator", href: "/calculator", icon: Calculator, badge: null },
  { name: "Analytics", href: "/analytics", icon: TrendingUp, badge: null },
  { name: "Favorites", href: "/favorites", icon: Star, badge: null },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <nav className="p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </h2>
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-11 px-3",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className={cn("text-xs", isActive ? "bg-white/20 text-white" : "")}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          )
        })}

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start h-8" asChild>
                <Link href="/scanner">
                  <Camera className="mr-2 h-3 w-3" />
                  Scan Document
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-8" asChild>
                <Link href="/documents/upload">
                  <Upload className="mr-2 h-3 w-3" />
                  Upload File
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-8" asChild>
                <Link href="/case-laws">
                  <Search className="mr-2 h-3 w-3" />
                  Quick Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}
