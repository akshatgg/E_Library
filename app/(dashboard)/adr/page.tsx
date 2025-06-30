import { ADRSuggestions } from "@/components/ui/adr/adr-suggestions"

export default function ADRPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Alternative Dispute Resolution</h1>
        <p className="text-gray-600">
          Get AI-powered recommendations for the best dispute resolution method for your case
        </p>
      </div>

      <ADRSuggestions />
    </div>
  )
}
