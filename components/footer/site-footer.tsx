"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SiteFooter: FC = () => {
  const pathname = usePathname();   
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h3 className="text-lg font-bold mb-4">E-Library</h3>
            <p className="text-gray-600 text-sm">
              Your comprehensive legal research platform with access to Indian case laws,
              documents, and professional legal resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/library" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Case Library
                </Link>
              </li>
              <li>
                <Link 
                  href="/documents" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Document Generation
                </Link>
              </li>
              <li>
                <Link 
                  href="/case-laws" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Case Law Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} E-Library. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Contact Us
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href="/support" 
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
