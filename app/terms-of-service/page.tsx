"use client";

import { FC } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertTriangle, Scale, Copy, CreditCard, Users } from "lucide-react";

const TermsOfServicePage: FC = () => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-white py-16 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last Updated: {currentDate}</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <FileText className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Introduction</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  These Terms of Service ("Terms") govern your access to and use of E-Library's website, 
                  mobile application, and services, including the legal document generation system, 
                  case law database, and other features (collectively, the "Services").
                </p>
                <p className="text-gray-600">
                  By accessing or using the Services, you agree to be bound by these Terms. If you disagree 
                  with any part of the Terms, you may not access the Services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">User Accounts</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  To access certain features of our Services, you may be required to create an account. 
                  You are responsible for maintaining the confidentiality of your account credentials 
                  and for all activities that occur under your account.
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>You must be at least 18 years of age to create an account.</li>
                  <li>You must provide accurate and complete information when creating your account.</li>
                  <li>You are responsible for safeguarding your password and for all activities that occur under your account.</li>
                  <li>You must notify us immediately of any unauthorized use of your account or any other breach of security.</li>
                  <li>We reserve the right to terminate accounts or suspend access at our discretion.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Scale className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Legal Case Database & Document Generation</h2>
                </div>
                <h3 className="text-lg font-medium mb-3">Case Law Access</h3>
                <p className="text-gray-600 mb-4">
                  Our platform provides access to legal case information sourced from Indian Kanoon and 
                  other public and private legal databases. By using our Services, you agree to the following:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>The legal information and case laws provided are for reference and research purposes only.</li>
                  <li>We strive for accuracy but cannot guarantee that all information is complete, current, or error-free.</li>
                  <li>Case law content is subject to copyright and usage restrictions of the original sources.</li>
                  <li>Users must not misuse or misrepresent the information accessed through our Services.</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">Document Generation</h3>
                <p className="text-gray-600 mb-4">
                  Our document generation services allow you to create legal documents based on templates. By using these services, you agree:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>The document templates are provided for convenience and are not a substitute for legal advice.</li>
                  <li>You are responsible for ensuring the accuracy and appropriateness of any document you generate.</li>
                  <li>We do not review, analyze, or provide legal advice on documents you generate.</li>
                  <li>Documents generated should be reviewed by qualified legal professionals before use.</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                  <div className="flex">
                    <AlertTriangle className="h-6 w-6 text-yellow-700 mr-3" />
                    <p className="text-sm text-yellow-700">
                      <span className="font-bold">Disclaimer:</span> Our platform is a research tool and document 
                      generation utility, not a substitute for professional legal advice. Always consult with a 
                      qualified attorney for specific legal matters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Copy className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Intellectual Property</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  The Service and its original content, features, and functionality are owned by E-Library 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property or proprietary rights laws.
                </p>
                <p className="text-gray-600 mb-4">
                  Our platform includes content from multiple sources:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Case laws from Indian Kanoon and other legal databases are subject to their respective terms and conditions.</li>
                  <li>Document templates created by E-Library are our intellectual property.</li>
                  <li>User-generated content remains the property of the user, but you grant us a license to use, store, and display it in connection with providing the Services.</li>
                </ul>
                <p className="text-gray-600">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, 
                  publicly perform, republish, download, store, or transmit any of the material on our 
                  platform, except as permitted by these Terms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Subscription and Payments</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Some features of our Services require a subscription. By subscribing to our Services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>You agree to pay all fees in accordance with the subscription plan you select.</li>
                  <li>Subscription fees are billed in advance on a recurring basis, depending on the plan you select.</li>
                  <li>You authorize us to charge the payment method you provide for all applicable fees.</li>
                  <li>Subscription fees are non-refundable except as required by law or as expressly stated in these Terms.</li>
                  <li>We may change subscription fees by giving you notice before the changes take effect.</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">Free Trials</h3>
                <p className="text-gray-600 mb-4">
                  We may offer free trials to new users. At the end of the trial period, your account will 
                  automatically be charged for the subscription unless you cancel before the trial ends.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Limitations of Liability</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  To the maximum extent permitted by law, E-Library, its directors, employees, partners, 
                  agents, suppliers, or affiliates, shall not be liable for any indirect, incidental, 
                  special, consequential or punitive damages, including without limitation, loss of 
                  profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Your access to or use of or inability to access or use the Services.</li>
                  <li>Any conduct or content of any third party on the Services.</li>
                  <li>Any content obtained from the Services.</li>
                  <li>Unauthorized access, use or alteration of your transmissions or content.</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                  <div className="flex">
                    <AlertTriangle className="h-6 w-6 text-yellow-700 mr-3" />
                    <p className="text-sm text-yellow-700">
                      <span className="font-bold">Important:</span> The legal information provided through 
                      our Services is not guaranteed to be complete, accurate, or up-to-date. Use of our 
                      document generation tools does not create an attorney-client relationship. Always 
                      consult with a qualified attorney for specific legal matters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <FileText className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We may modify or revise these Terms at any time at our sole discretion. If we make changes, 
                  we will notify you by updating the date at the top of these Terms and, in some cases, we 
                  may provide you with additional notice.
                </p>
                <p className="text-gray-600 mb-4">
                  Your continued use of our Services after the Terms have been updated constitutes your 
                  acceptance of the updated Terms.
                </p>
                <p className="text-gray-600">
                  If you have any questions about these Terms, please contact us at terms@elibrary.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

     
    </div>
  );
};

export default TermsOfServicePage;
