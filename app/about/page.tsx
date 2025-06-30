import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Eye, Heart, Award, Building } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      experience: "15+ years in Tax Law",
      specialization: "Income Tax, GST",
    },
    {
      name: "Priya Sharma",
      role: "Head of Legal Research",
      experience: "12+ years in Legal Research",
      specialization: "Case Law Analysis",
    },
    {
      name: "Amit Patel",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About iTaxEasy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering legal professionals with AI-powered research tools, comprehensive case law databases, and
            intelligent document management solutions since 2020.
          </p>
        </div>

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
                To democratize access to legal information and empower every legal professional with cutting-edge
                technology that makes research faster, more accurate, and more insightful.
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
                To become the world's most trusted platform for legal research and document management, setting new
                standards for accuracy, speed, and user experience in legal technology.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="mb-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  Founded in 2020 by a team of experienced tax lawyers and technology experts, iTaxEasy was born from
                  the frustration of spending countless hours searching through scattered legal databases and outdated
                  research tools.
                </p>
                <p className="text-lg leading-relaxed">
                  We recognized that legal professionals needed a unified platform that could intelligently organize,
                  search, and analyze vast amounts of legal information while providing actionable insights.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we serve over 10,000+ legal professionals across India, helping them save time, improve
                  accuracy, and deliver better outcomes for their clients.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">50,000+</div>
                    <div className="text-sm text-muted-foreground">Case Laws</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
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
                  123 Business District
                  <br />
                  Mumbai, Maharashtra 400001
                  <br />
                  India
                </p>
              </div>
              <div>
                <div className="h-8 w-8 mx-auto mb-3 flex items-center justify-center">📧</div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm opacity-90">
                  info@itaxeasy.com
                  <br />
                  support@itaxeasy.com
                </p>
              </div>
              <div>
                <div className="h-8 w-8 mx-auto mb-3 flex items-center justify-center">📞</div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm opacity-90">
                  +91 22 1234 5678
                  <br />
                  +91 22 8765 4321
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
