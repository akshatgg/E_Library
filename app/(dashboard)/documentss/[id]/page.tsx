import { DocumentDetailView } from "@/components/ui/documents/document-detail-view"

interface DocumentDetailPageProps {
  params: { id: string }
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  return <DocumentDetailView documentId={params.id} />
}
