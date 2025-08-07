    "use client";

import { FC } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, Clock, Server, Eye, FileText, Shield } from "lucide-react";

const PrivacyPolicyPage: FC = () => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: {currentDate}</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Lock className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Introduction</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Welcome to E-Library. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit our 
                  website and tell you about your privacy rights and how the law protects you.
                </p>
                <p className="text-gray-600">
                  E-Library provides access to legal information, case laws from Indian Kanoon and other sources, 
                  document generation tools, and other legal research resources. This policy applies to all users 
                  of our platform and services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <FileText className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Information We Collect</h2>
                </div>
                
                <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Identity Data: Includes name, username or similar identifier, title.</li>
                  <li>Contact Data: Includes email address, billing address, and telephone numbers.</li>
                  <li>Financial Data: Includes payment card details for subscription services.</li>
                  <li>Transaction Data: Includes details about payments to and from you and details of services you have purchased from us.</li>
                  <li>Profile Data: Includes your username and password, your interests, preferences, feedback and survey responses.</li>
                  <li>Usage Data: Includes information about how you use our website and services, including search queries and documents accessed.</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">Search Data & Case Law Access</h3>
                <p className="text-gray-600 mb-4">
                  When you use our case law search functionality:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>We store your search queries to improve our service.</li>
                  <li>We track which case laws you view to provide features like "recently viewed" and personalized suggestions.</li>
                  <li>We collect data on document generation usage to improve our templates.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Server className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We use your personal data for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>To provide our legal research services and document generation tools</li>
                  <li>To manage your account and subscription</li>
                  <li>To personalize your experience and offer relevant content</li>
                  <li>To improve our platform based on your feedback and usage patterns</li>
                  <li>To communicate with you about updates, maintenance, or support</li>
                  <li>To comply with legal obligations</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">Legal Basis for Processing</h3>
                <p className="text-gray-600 mb-4">
                  We process your personal data under the following legal bases:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Performance of a contract when we provide you with our services</li>
                  <li>Your consent, where applicable</li>
                  <li>Legitimate interests in operating and improving our business</li>
                  <li>Compliance with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Data Security & Storage</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We have implemented appropriate security measures to prevent your personal data from being 
                  accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                </p>
                <p className="text-gray-600 mb-4">
                  We limit access to your personal data to those employees, agents, contractors and other third 
                  parties who have a business need to know. They will only process your personal data on our 
                  instructions and they are subject to a duty of confidentiality.
                </p>
                <p className="text-gray-600 mb-4">
                  We store your data securely in India on protected servers. We retain your personal data only 
                  for as long as necessary to fulfill the purposes for which we collected it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Your Privacy Rights</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Request access to your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request erasure of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p className="text-gray-600">
                  If you wish to exercise any of these rights, please contact us at privacy@elibrary.com.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Clock className="h-6 w-6 text-blue-700 mr-3" />
                  <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We may update this privacy policy from time to time. The updated version will be indicated by an 
                  updated "Last Updated" date and the updated version will be effective as soon as it is accessible. 
                  We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
                </p>
                <p className="text-gray-600">
                  If you have any questions about this privacy policy, please contact us at privacy@elibrary.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

    
    </div>
  );
};

export default PrivacyPolicyPage;
