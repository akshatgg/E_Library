"use client"

import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin } from "lucide-react"

export function DashboardFooter() {
  return (
    <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">E-Library</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional legal document management platform powered by AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <div className="space-y-2">
              <Link href="/case-laws" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Case Law Search
              </Link>
              <Link href="/documents" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Document Management
              </Link>
              <Link href="/valuation" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Valuation Reports
              </Link>
              <Link href="/forms" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Legal Forms
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="/docs" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Documentation
              </Link>
              <Link href="/api" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                API Reference
              </Link>
              <Link href="/support" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Support Center
              </Link>
              <Link href="/tutorials" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                Tutorials
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@itaxeasy.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 iTax Easy Private Limited. All rights reserved. | Powered by Next.js & AI
          </p>
        </div>
      </div>
    </footer>
  )
}
