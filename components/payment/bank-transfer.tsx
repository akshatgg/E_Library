"use client"

import { Landmark, Copy, CheckCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface BankTransferProps {
  amount: number
}

export function BankTransfer({ amount }: BankTransferProps) {
  const { toast } = useToast()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const bankDetails = {
    accountNumber: "1234567890",
    ifsc: "SBIN0001234",
    accountName: "E-Library Solutions",
    bankName: "State Bank of India",
  }

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      toast({
        title: `${field} Copied`,
        description: `${field} has been copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 3000)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Landmark className="h-5 w-5 text-muted-foreground" />
        <div className="font-medium">Bank Transfer Details</div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Account Number</div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{bankDetails.accountNumber}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy("Account Number", bankDetails.accountNumber)}
              >
                {copiedField === "Account Number" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">IFSC Code</div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{bankDetails.ifsc}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy("IFSC Code", bankDetails.ifsc)}
              >
                {copiedField === "IFSC Code" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Account Name</div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{bankDetails.accountName}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy("Account Name", bankDetails.accountName)}
              >
                {copiedField === "Account Name" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Bank Name</div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{bankDetails.bankName}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy("Bank Name", bankDetails.bankName)}
              >
                {copiedField === "Bank Name" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-3 mt-3">
            <div className="text-sm text-muted-foreground">Amount to Transfer</div>
            <div className="font-medium">₹{(amount / 100).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Please use your email as reference when making the bank transfer. Your account will be updated once the payment
        is confirmed.
      </div>
    </div>
  )
}
