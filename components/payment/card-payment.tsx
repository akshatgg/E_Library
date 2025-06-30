"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Check, CreditCard } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CardBrands } from "./card-brands"

interface CardPaymentProps {
  amount: number
}

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(19, "Card number must be less than 19 digits")
    .regex(/^[0-9\s]+$/, "Card number must contain only digits"),
  cardholderName: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
})

type FormValues = z.infer<typeof formSchema>

export function CardPayment({ amount }: CardPaymentProps) {
  const [cardType, setCardType] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const detectCardType = (cardNumber: string) => {
    const regexes = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      maestro: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/,
      rupay: /^6[0-9]{15}$/,
    }

    const cleanedNumber = cardNumber.replace(/\s+/g, "")

    for (const [type, regex] of Object.entries(regexes)) {
      if (regex.test(cleanedNumber)) {
        return type
      }
    }

    // Check prefixes for other common card types
    if (cleanedNumber.startsWith("4")) return "visa"
    if (/^5[1-5]/.test(cleanedNumber)) return "mastercard"
    if (/^3[47]/.test(cleanedNumber)) return "amex"
    if (/^6/.test(cleanedNumber)) return "discover"

    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-medium text-sm">Enter Card Details</div>
        <CardBrands activeCard={cardType} />
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      value={formatCardNumber(field.value)}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        field.onChange(formatted)
                        setCardType(detectCardType(formatted))
                      }}
                      maxLength={19}
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardholder Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
                      {...field}
                      value={formatExpiryDate(field.value)}
                      onChange={(e) => {
                        field.onChange(formatExpiryDate(e.target.value))
                      }}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} type="password" maxLength={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
        <Check className="h-4 w-4" />
        <span>Your card details are secure and encrypted</span>
      </div>
    </div>
  )
}
