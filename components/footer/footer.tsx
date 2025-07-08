"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

export default function Footer() {
  return (
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
  )
}
