"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HeadphonesIcon,
  Building,
  Globe,
  CheckCircle,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      })
    }, 3000)
  }

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@itaxeasy.com",
      availability: "24/7 Response",
      action: "Send Email",
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "Phone Support",
      description: "Speak with our experts",
      contact: "+91 98765 43210",
      availability: "Mon-Fri 9AM-6PM",
      action: "Call Now",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      title: "Live Chat",
      description: "Instant chat support",
      contact: "Available on website",
      availability: "Mon-Fri 9AM-6PM",
      action: "Start Chat",
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-orange-600" />,
      title: "Technical Support",
      description: "Technical assistance",
      contact: "tech@itaxeasy.com",
      availability: "24/7 Available",
      action: "Get Help",
    },
  ]

  const offices = [
    {
      city: "New Delhi",
      address: "123 Legal District, Connaught Place",
      postal: "New Delhi, India 110001",
      phone: "+91 98765 43210",
      email: "delhi@itaxeasy.com",
    },
    {
      city: "Mumbai",
      address: "456 Business Hub, Bandra Kurla Complex",
      postal: "Mumbai, India 400051",
      phone: "+91 87654 32109",
      email: "mumbai@itaxeasy.com",
    },
    {
      city: "Bangalore",
      address: "789 Tech Park, Electronic City",
      postal: "Bangalore, India 560100",
      phone: "+91 76543 21098",
      email: "bangalore@itaxeasy.com",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you with any questions or support you need.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{method.description}</p>
                <p className="font-medium mb-2">{method.contact}</p>
                <Badge variant="outline" className="mb-4">
                  {method.availability}
                </Badge>
                <Button variant="outline" size="sm" className="w-full">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="w-6 h-6" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Pricing</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject *</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message *</label>
                    <Textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Enter your message here..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Office Locations & Info */}
          <div className="space-y-6">
            {/* Business Hours */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Emergency support available 24/7 for critical issues
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-lg">{office.city}</h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{office.address}</p>
                          <p>{office.postal}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{office.email}</span>
                      </div>
                    </div>
                    {index < offices.length - 1 && <div className="border-b pt-4"></div>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule a Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HeadphonesIcon className="w-4 h-4 mr-2" />
                  Technical Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How quickly do you respond to inquiries?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We typically respond to all inquiries within 24 hours during business days. For urgent technical
                    issues, we provide 24/7 support.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Do you offer phone support?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Yes, we offer phone support during business hours. You can also schedule a call at your convenience
                    through our booking system.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I visit your office?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We welcome office visits. Please schedule an appointment in advance to ensure our team is available
                    to assist you.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What information should I include in my message?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please include as much detail as possible about your inquiry, including any error messages, account
                    information, and steps you've already tried.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Do you provide training sessions?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Yes, we offer comprehensive training sessions for teams and individuals. Contact us to learn more
                    about our training programs.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How can I report a bug or suggest a feature?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    You can report bugs or suggest features through our contact form, selecting the appropriate
                    category, or email us directly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
