"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, CheckCircle, AlertCircle, Key, FileText, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { validateApiKeys } from "@/lib/api-config"

export function ApiRegistrationGuide() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("government")
  const [apiKeyStatus, setApiKeyStatus] = useState(validateApiKeys())

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const governmentApis = [
    {
      name: "Supreme Court of India",
      key: "SUPREME_COURT",
      status: "Public API",
      steps: [
        "Visit https://main.sci.gov.in/developer",
        "No registration required for basic access",
        "Rate limit: 100 requests/hour",
        "For higher limits, contact: webmaster@sci.gov.in",
      ],
      envVar: "Not required",
      free: true,
    },
    {
      name: "High Courts (eCourts)",
      key: "HIGH_COURTS",
      status: "Registration Required",
      steps: [
        "Visit https://ecourts.gov.in/developer-portal",
        "Click 'Register for API Access'",
        "Fill application form with organization details",
        "Submit documents: Organization registration, Purpose statement",
        "Wait for approval (7-14 days)",
        "Receive API key via email",
      ],
      envVar: "HIGH_COURTS_API_KEY",
      documents: ["Organization Registration Certificate", "Letter of Purpose", "Technical Contact Details"],
      free: true,
    },
    {
      name: "ITAT (Income Tax Appellate Tribunal)",
      key: "ITAT",
      status: "Registration Required",
      steps: [
        "Visit https://itat.gov.in/api-registration",
        "Create developer account",
        "Submit API access request",
        "Provide: CA/Advocate registration number",
        "Wait for manual approval",
        "Download API credentials",
      ],
      envVar: "ITAT_API_KEY",
      documents: ["Professional Registration Certificate", "Practice Certificate"],
      free: true,
    },
    {
      name: "Income Tax Department (CBDT)",
      key: "INCOME_TAX_DEPT",
      status: "Professional Access Only",
      steps: [
        "Visit https://incometaxindia.gov.in/developer",
        "Login with PAN-based credentials",
        "Apply for 'Professional API Access'",
        "Submit CA/Tax Practitioner certificate",
        "Pay processing fee: ₹1000",
        "Receive API key after verification",
      ],
      envVar: "INCOME_TAX_API_KEY",
      documents: ["CA Certificate", "Tax Practitioner Registration", "PAN Card"],
      fee: "₹1000 processing fee",
      free: false,
    },
  ]

  const commercialApis = [
    {
      name: "Indian Kanoon",
      key: "INDIAN_KANOON",
      pricing: "Free: 100 requests/day | Paid: ₹5000/month",
      steps: [
        "Visit https://indiankanoon.org/api",
        "Create free account",
        "Verify email address",
        "Generate API key from dashboard",
        "For paid plans: Contact sales@indiankanoon.org",
      ],
      envVar: "INDIAN_KANOON_API_KEY",
      contact: "sales@indiankanoon.org",
      free: true,
    },
    {
      name: "Manupatra",
      key: "MANUPATRA",
      pricing: "₹15,000/month for full access",
      steps: [
        "Visit https://manupatra.com/api-access",
        "Fill enterprise inquiry form",
        "Schedule demo call",
        "Negotiate pricing and terms",
        "Sign API license agreement",
        "Receive API credentials",
      ],
      envVar: "MANUPATRA_API_KEY",
      contact: "api-sales@manupatra.com",
      phone: "+91-11-4069-8000",
      free: false,
    },
    {
      name: "SCC Online",
      key: "SCC_ONLINE",
      pricing: "₹12,000/month",
      steps: [
        "Visit https://scconline.com/api",
        "Request API access quote",
        "Provide organization details",
        "Review API license terms",
        "Make payment",
        "Receive API documentation and keys",
      ],
      envVar: "SCC_ONLINE_API_KEY",
      contact: "support@scconline.com",
      phone: "+91-11-4890-8000",
      free: false,
    },
    {
      name: "Westlaw India",
      key: "WESTLAW_INDIA",
      pricing: "₹25,000/month (Enterprise)",
      steps: [
        "Visit https://westlawindia.com/api-enterprise",
        "Contact enterprise sales team",
        "Provide detailed use case",
        "Receive custom pricing quote",
        "Sign enterprise agreement",
        "Get dedicated API access",
      ],
      envVar: "WESTLAW_INDIA_API_KEY",
      contact: "enterprise@westlawindia.com",
      phone: "+91-80-6749-8000",
      free: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">API Setup Guide</h1>
        <p className="text-muted-foreground mt-2">
          Complete guide to set up real API keys for government and commercial legal databases
        </p>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Store all API keys securely in environment variables. Never commit API keys to
          version control.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="government">Government APIs</TabsTrigger>
          <TabsTrigger value="commercial">Commercial APIs</TabsTrigger>
          <TabsTrigger value="setup">Environment Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="government" className="space-y-4">
          <div className="grid gap-4">
            {governmentApis.map((api) => (
              <Card key={api.key}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {api.name}
                        {api.free ? <Badge variant="secondary">Free</Badge> : <Badge variant="outline">Paid</Badge>}
                      </CardTitle>
                      <CardDescription>{api.status}</CardDescription>
                    </div>
                    {apiKeyStatus[`${api.key}_API_KEY`] ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Registration Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {api.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {api.documents && (
                    <div>
                      <h4 className="font-semibold mb-2">Required Documents:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {api.documents.map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {api.fee && (
                    <Alert>
                      <CreditCard className="h-4 w-4" />
                      <AlertDescription>{api.fee}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Environment Variable:</Label>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{api.envVar}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(api.envVar)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              Commercial APIs require paid subscriptions. Contact sales teams for enterprise pricing and custom terms.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {commercialApis.map((api) => (
              <Card key={api.key}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {api.name}
                        {api.free ? (
                          <Badge variant="secondary">Free Tier Available</Badge>
                        ) : (
                          <Badge variant="destructive">Paid Only</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{api.pricing}</CardDescription>
                    </div>
                    {apiKeyStatus[`${api.key}_API_KEY`] ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Setup Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {api.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Contact Email:</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded text-sm">{api.contact}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(api.contact)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {api.phone && (
                      <div>
                        <Label className="text-sm font-medium">Phone:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-muted px-2 py-1 rounded text-sm">{api.phone}</code>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(api.phone)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Environment Variable:</Label>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{api.envVar}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(api.envVar)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Setup</CardTitle>
              <CardDescription>Add these environment variables to your .env.local file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="env-content">Copy this to your .env.local file:</Label>
                <Textarea
                  id="env-content"
                  className="mt-2 font-mono text-sm"
                  rows={15}
                  readOnly
                  value={`# Government API Keys
HIGH_COURTS_API_KEY=your_high_courts_api_key_here
ITAT_API_KEY=your_itat_api_key_here
INCOME_TAX_API_KEY=your_income_tax_api_key_here
LAW_MINISTRY_API_KEY=your_law_ministry_api_key_here
NJDG_API_KEY=your_njdg_api_key_here

# Commercial API Keys
INDIAN_KANOON_API_KEY=your_indian_kanoon_api_key_here
MANUPATRA_API_KEY=your_manupatra_api_key_here
SCC_ONLINE_API_KEY=your_scc_online_api_key_here
WESTLAW_INDIA_API_KEY=your_westlaw_india_api_key_here

# Additional Configuration
API_RATE_LIMIT_ENABLED=true
API_CACHE_DURATION=3600
API_TIMEOUT=30000`}
                />
                <Button
                  className="mt-2"
                  onClick={() => copyToClipboard(document.getElementById("env-content")?.textContent || "")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Environment Variables
                </Button>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Note:</strong> Add .env.local to your .gitignore file to prevent API keys from being
                  committed to version control.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">Current API Status:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(apiKeyStatus).map(([key, configured]) => (
                    <div key={key} className="flex items-center gap-2">
                      {configured ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <span className="text-sm">{key.replace("_API_KEY", "").replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing API Connections</CardTitle>
              <CardDescription>Use these commands to test your API connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <code className="block bg-muted p-2 rounded text-sm">npm run test:apis</code>
                <code className="block bg-muted p-2 rounded text-sm">npm run validate:env</code>
                <code className="block bg-muted p-2 rounded text-sm">npm run check:api-status</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
