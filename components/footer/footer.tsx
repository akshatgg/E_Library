"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Router,
} from "lucide-react"
import { useRouter } from "next/navigation"
export default function Footer() {
  const router = useRouter();
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">E-Library</span>
            </div>
            <p className="text-gray-400 mb-4">
              Revolutionary legal technology platform powered by AI and quantum computing principles.
            </p>
       
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" onClick={()=> router.push("/contact")}>
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={()=> router.push("/contact")}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={()=> router.push("/contact")}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
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
                <Link href="/library" className="hover:text-white transition-colors">
                  Legal Library
                </Link>
              </li>
              <li>
                <Link href="/valuation" className="hover:text-white transition-colors">
                  Valuation Reports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/case-laws/categories" className="hover:text-white transition-colors">
                  Case Categories
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-white transition-colors">
                  Document Templates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 iTax Easy Private Limited. All rights reserved. | Powered by Itaxeasy
          </p>
        </div>
      </div>
    </footer>
  )
}
