"use client"

import { QrCode, Smartphone, Copy, CheckCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface UpiPaymentProps {
  amount: number
}

export function UpiPayment({ amount }: UpiPaymentProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const upiId = "elibrary@ybl"

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true)
      toast({
        title: "UPI ID Copied",
        description: "UPI ID has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center">
        <QrCode className="h-16 w-16 mb-4 text-primary" />
        <div className="w-48 h-48 bg-white p-2 rounded-lg mb-4">
          {/* In a real app, generate a real QR code for the payment */}
          <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-xs text-gray-500">QR Code for</p>
              <p className="font-semibold text-sm">{upiId}</p>
              <p className="text-xs text-gray-500 mt-1">₹{(amount / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="text-sm text-center text-muted-foreground">Scan this QR code using any UPI app to pay</div>
      </div>

      <div className="flex items-center space-x-2">
        <Smartphone className="h-5 w-5 text-muted-foreground" />
        <div className="font-medium">Pay using UPI ID</div>
      </div>

      <div className="flex space-x-2">
        <Input value={upiId} readOnly className="flex-1" />
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Use this UPI ID in your payment app to complete the transaction
      </div>
    </div>
  )
}
