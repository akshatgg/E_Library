import { OfflineLibrary } from "@/components/offline/offline-library"
import { OfflineManager } from "@/components/offline/offline-manager"

export default function OfflinePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Offline Library</h1>
      <p className="text-muted-foreground">Access your saved documents even when you're offline.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OfflineLibrary />
        </div>
        <div>
          <OfflineManager />
        </div>
      </div>
    </div>
  )
}
