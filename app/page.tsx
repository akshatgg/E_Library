"use client"
import { auth,getUserDataFromFirestore  } from "@/lib/firebase";

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Search,
  FileText,
  Scale,
  LogOut,
  User,
  Moon,
  Sun,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import { set } from "date-fns";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  type UserData = {
    displayName?: string;
    // Add other properties if needed
    [key: string]: any;
  };
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, isLoading, router])
  

useEffect(() => {
  const loadUserData = async () => {
    if (auth.currentUser) {
      const userData = await getUserDataFromFirestore(auth.currentUser.uid);
      console.log("User Data:", userData);
      setUserData(userData);
    }
  };

  loadUserData();
}, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  E-Library
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">by iTax Easy</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
             <Badge
      variant="secondary"
      className="hidden sm:flex items-center group cursor-pointer"
      onClick={() => router.push("/dashboard")}
    >
      <User className="w-3 h-3 mr-1" />
      {userData?.displayName}
    </Badge>

              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              <span className="text-gray-800 dark:text-white">Legal Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the future of legal research with AI-powered document management, quantum-speed case law
              search, and intelligent document generation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                <Shield className="w-4 h-4 mr-2" />
                Secure & Compliant
              </Badge>
              <Badge className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                <Globe className="w-4 h-4 mr-2" />
                Real-time Updates
              </Badge>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Case Law Search */}
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">AI Case Law Search</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Quantum-powered search across Supreme Court, High Courts, ITAT, and Income Tax Department cases.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <li>• Advanced semantic search</li>
                    <li>• Citation network analysis</li>
                    <li>• Real-time case updates</li>
                    <li>• Precedent tracking</li>
                  </ul>
                  <Link href="/case-laws">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                      <Search className="w-4 h-4 mr-2" />
                      Explore Cases
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Document Management */}
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Smart Document Hub</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    AI-powered document generation and management with automated templates.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <li>• Partnership deed generator</li>
                    <li>• HUF deed automation</li>
                    <li>• Reply letter templates</li>
                    <li>• Document analytics</li>
                  </ul>
                  <Link href="/documents">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Documents
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Valuation Reports */}
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Valuation Intelligence</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Professional property and asset valuation with AI-powered market analysis.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <li>• Property valuation</li>
                    <li>• Asset assessment</li>
                    <li>• Market analysis</li>
                    <li>• Compliance reports</li>
                  </ul>
                  <Link href="/valuation">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                      <Scale className="w-4 h-4 mr-2" />
                      Generate Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
                <div className="text-gray-600 dark:text-gray-400">Case Laws</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
                <div className="text-gray-600 dark:text-gray-400">Documents</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-600 dark:text-gray-400">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">E-Library</span>
              </div>
              <p className="text-gray-400 mb-4">
                Revolutionary legal technology platform powered by AI and quantum computing principles.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/case-laws" className="hover:text-white transition-colors">
                    Case Law Search
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="hover:text-white transition-colors">
                    Document Generation
                  </Link>
                </li>
                <li>
                  <Link href="/valuation" className="hover:text-white transition-colors">
                    Valuation Reports
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-white transition-colors">
                    Legal Library
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 iTax Easy Private Limited. All rights reserved. | Powered by Next.js & AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
