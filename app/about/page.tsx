"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, Eye, Heart, Award, Building, Library, Scale, FileText, Search, Gavel } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Mukul Bedi",
      role: "Founder & CEO",
      experience: "15+ years in Tax Law",
      specialization: "Income Tax, GST",
    },
    {
      name: "Sonali",
      role: "Head of Legal Research",
      experience: "12+ years in Legal Research",
      specialization: "Case Law Analysis",
    },
    {
      name: "Sonali",
      role: "Technology Director",
      experience: "10+ years in Legal Tech",
      specialization: "AI & Legal Analytics",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Accuracy",
      description: "We ensure every case law and document is thoroughly verified and up-to-date",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear, accessible legal information for all professionals",
    },
    {
      icon: Heart,
      title: "Client-Centric",
      description: "Your success is our priority - we build tools that truly help",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Continuous improvement and innovation in legal technology",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <section className="bg-white py-16 border-b">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About E-Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              India's premier legal research platform providing comprehensive access to case laws, 
              legal documents, and professional resources for legal practitioners.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="h-8 w-8" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                To democratize access to Indian legal information by providing a comprehensive platform 
                with case laws from Indian Kanoon and other sources, empowering legal professionals with cutting-edge 
                document generation tools and research capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Eye className="h-8 w-8" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                To become India's most trusted platform for legal research and document generation, 
                setting new standards for case law access, document automation, and legal analytics
                while making legal information more accessible to all practitioners.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="mb-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">E-Library Platform</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  Founded by a team of experienced legal practitioners and technology experts, E-Library was created to address 
                  the challenges of accessing comprehensive Indian case law research and legal document generation.
                </p>
                <p className="text-lg leading-relaxed">
                  Our platform integrates with Indian Kanoon and other legal databases to provide seamless access to case laws 
                  from ITAT, GST, Income Tax, High Courts, and Supreme Court. We've built specialized tools for legal professionals 
                  to search, analyze, and utilize this information effectively.
                </p>
                <p className="text-lg leading-relaxed">
                  E-Library's document generation system enables practitioners to create professional legal documents with ease, 
                  combining our extensive template library with intelligent automation to save time and reduce errors.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">500,000+</div>
                    <div className="text-sm text-muted-foreground">Indian Case Laws</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">100+</div>
                    <div className="text-sm text-muted-foreground">Document Templates</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">5+</div>
                    <div className="text-sm text-muted-foreground">Court Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <Tabs defaultValue="case-laws" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-lg mx-auto mb-8">
              <TabsTrigger value="case-laws">Case Law Database</TabsTrigger>
              <TabsTrigger value="document-generation">Document Generation</TabsTrigger>
            </TabsList>
            <TabsContent value="case-laws" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                      <Library className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center">Comprehensive Case Law Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>E-Library provides access to over 500,000 case laws from multiple courts including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Supreme Court of India</li>
                      <li>High Courts across all states</li>
                      <li>Income Tax Appellate Tribunal (ITAT)</li>
                      <li>GST Appellate Tribunal</li>
                      <li>Consumer Forums and specialized courts</li>
                    </ul>
                    <p>Our advanced search algorithms help you quickly find relevant precedents and judgments for your legal research.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center">Research & Analysis Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Our platform features specialized tools to enhance your legal research:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Citation network visualization to track case references</li>
                      <li>Advanced filtering by court, judge, date, and subject matter</li>
                      <li>Similar cases suggestion engine</li>
                      <li>Offline access to saved case laws</li>
                      <li>PDF annotation and highlighting capabilities</li>
                      <li>Personalized dashboard with saved searches and cases</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="document-generation" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center">Document Templates & Generation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Create professional legal documents quickly with our extensive template library:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Legal notices and demand letters</li>
                      <li>Court petitions and applications</li>
                      <li>Legal opinions and memorandums</li>
                      <li>Contracts and agreements</li>
                      <li>Tax filings and representations</li>
                    </ul>
                    <p>All templates are regularly updated to reflect the latest legal requirements and best practices.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                      <Gavel className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center">Professional PDF Generation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Our advanced PDF generation system offers:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Professional formatting with legal standards</li>
                      <li>Integration of case law citations directly from our database</li>
                      <li>Custom letterheads and branding options</li>
                      <li>Digital signature capabilities</li>
                      <li>Secure document storage and sharing</li>
                      <li>Batch processing for multiple documents</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                  <p className="text-sm font-medium">{member.specialization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">Get In Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Building className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Head Office</h3>
                <p className="text-sm opacity-90">
                 G 41, Tansen Rd, Defence Colony, Gandhi Nagar
                  <br />
                  Gwalior, Madhya Pradesh 474002
                  <br />
                  India
                </p>
              </div>
              <div>
                <div className="h-8 w-8 mx-auto mb-3 flex items-center justify-center">📧</div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm opacity-90">
                
                  info@itaxeasy.com
                </p>
              </div>
              <div>
                <div className="h-8 w-8 mx-auto mb-3 flex items-center justify-center">📞</div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm opacity-90">
                  +91 9425113371
                  
                  
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
