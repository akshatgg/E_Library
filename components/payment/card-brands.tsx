"use client"

interface CardBrandsProps {
  activeCard: string | null
}

export function CardBrands({ activeCard }: CardBrandsProps) {
  return (
    <div className="flex space-x-1">
      <div className={`w-8 h-5 rounded border ${activeCard === "visa" ? "border-primary" : "border-muted opacity-50"}`}>
        <div className="flex items-center justify-center h-full">
          <span className="text-xs font-bold text-blue-700">VISA</span>
        </div>
      </div>

      <div
        className={`w-8 h-5 rounded border ${activeCard === "mastercard" ? "border-primary" : "border-muted opacity-50"}`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="relative w-4 h-3">
            <div className="absolute w-2 h-2 rounded-full bg-red-500 left-0 top-0.5"></div>
            <div className="absolute w-2 h-2 rounded-full bg-yellow-500 right-0 top-0.5"></div>
          </div>
        </div>
      </div>

      <div
        className={`w-8 h-5 rounded border ${activeCard === "rupay" ? "border-primary" : "border-muted opacity-50"}`}
      >
        <div className="flex items-center justify-center h-full">
          <span className="text-xs font-bold text-green-600">RuPay</span>
        </div>
      </div>

      <div className={`w-8 h-5 rounded border ${activeCard === "amex" ? "border-primary" : "border-muted opacity-50"}`}>
        <div className="flex items-center justify-center h-full">
          <span className="text-xs font-bold text-blue-500">AMEX</span>
        </div>
      </div>
    </div>
  )
}
