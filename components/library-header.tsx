import { BookOpenText } from "lucide-react"

export function LibraryHeader() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookOpenText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">E-Library Management</h1>
      </div>
      <p className="text-muted-foreground">
        Browse, manage, and view your legal document library with advanced search and filtering capabilities.
      </p>
    </div>
  )
}
