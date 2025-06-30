import { CaseLawDetailView } from "@/components/ui/case-laws/case-law-detail-view"

interface CaseLawDetailPageProps {
  params: { id: string }
}

export default function CaseLawDetailPage({ params }: CaseLawDetailPageProps) {
  return <CaseLawDetailView caseId={params.id} />
}
