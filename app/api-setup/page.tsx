import { ApiRegistrationGuide } from "@/components/api-setup/api-registration-guide"
import { BackButton } from "@/components/ui/back-button"

export default function ApiSetupPage() {
  return (
    <div className="container mx-auto py-6">
      <BackButton />
      <ApiRegistrationGuide />
    </div>
  )
}
