"use client"

import { useState } from "react"
import { Loader2, QrCode, CreditCard, Landmark, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { UpiPayment } from "@/components/payment/upi-payment"
import { CardPayment } from "@/components/payment/card-payment"
import { BankTransfer } from "@/components/payment/bank-transfer"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => Promise<void>
  amount: number
  description: string
}

export function PaymentModal({ isOpen, onClose, onSuccess, amount, description }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("upi")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      // In a real implementation, this would call a payment gateway API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate payment processing
      await onSuccess()
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formattedAmount = (amount / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            {description} - {formattedAmount}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            defaultValue="upi"
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
              <Label
                htmlFor="upi"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <QrCode className="mb-2 h-6 w-6" />
                UPI / QR
              </Label>
            </div>

            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-2 h-6 w-6" />
                Card
              </Label>
            </div>

            <div>
              <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
              <Label
                htmlFor="bank"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Landmark className="mb-2 h-6 w-6" />
                Bank
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-2">
          {paymentMethod === "upi" && <UpiPayment amount={amount} />}
          {paymentMethod === "card" && <CardPayment amount={amount} />}
          {paymentMethod === "bank" && <BankTransfer amount={amount} />}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
