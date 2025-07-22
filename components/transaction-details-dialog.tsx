"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Clock, IndianRupee, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Transaction {
  id: string
  orderId: string
  type: string
  credits: number
  amount: number
  status: "success" | "failed" | "pending"
  timestamp: Date
  description: string
  error?: {
    code: string
    description: string
  }
}

interface TransactionDetailsDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  const { toast } = useToast()

  if (!transaction) return null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStatusIcon(transaction.status)}
            <span>Transaction Details</span>
          </DialogTitle>
          <DialogDescription>
            Complete information about your transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Amount Section */}
          <div className="text-center space-y-3">
            <Badge
              variant={getStatusColor(transaction.status) as any}
              className="text-sm px-3 py-1"
            >
              {transaction.status.toUpperCase()}
            </Badge>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-3xl font-bold text-green-600">
                  +{transaction.credits}
                </span>
                <span className="text-lg text-muted-foreground">credits</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <IndianRupee className="h-5 w-5 text-muted-foreground" />
                <span className="text-xl font-semibold">{transaction.amount}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction Information */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                DESCRIPTION
              </h4>
              <p className="text-base">{transaction.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  TRANSACTION ID
                </h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs bg-muted px-2 py-1 rounded font-mono">
                    {transaction.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.id, "Transaction ID")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  ORDER ID
                </h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs bg-muted px-2 py-1 rounded font-mono">
                    {transaction.orderId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.orderId, "Order ID")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  DATE & TIME
                </h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    {format(new Date(transaction.timestamp), "MMMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.timestamp), "hh:mm:ss a")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  TYPE
                </h4>
                <p className="text-sm capitalize">{transaction.type}</p>
              </div>
            </div>

            {transaction.error && (
              <>
                <Separator />
                <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                  <h4 className="font-semibold text-sm text-destructive mb-1">
                    ERROR DETAILS
                  </h4>
                  <p className="text-sm text-destructive">
                    {transaction.error.code}: {transaction.error.description}
                  </p>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://dashboard.razorpay.com/app/payments/${transaction.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View on Razorpay
              </a>
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Transaction #{transaction.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
