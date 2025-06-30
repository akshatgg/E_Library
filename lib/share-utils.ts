export interface ShareData {
  title: string
  text: string
  url?: string
}

export async function shareContent(data: ShareData) {
  // Check if Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (error) {
      console.log("Error sharing:", error)
      return false
    }
  } else {
    // Fallback to copying to clipboard
    const shareText = `${data.title}\n${data.text}${data.url ? `\n${data.url}` : ""}`

    try {
      await navigator.clipboard.writeText(shareText)
      return true
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    }
  }
}

export function getShareableLink(type: string, id: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  return `${baseUrl}/${type}/${id}`
}
