export interface PartnershipDeedData {
  firmName: string
  registrationNumber?: string
  registrationDate: string
  businessNature: string
  principalPlace: Address
  duration: string
  partners: Partner[]
  capitalContributions: CapitalContribution[]
  profitSharingRatio: ProfitShare[]
  bankDetails: BankDetails
  witnessDetails: Witness[]
}

export interface HUFDeedData {
  hufName: string
  hufPan: string
  karta: PersonDetails
  coparceners: PersonDetails[]
  constitutionDate: string
  assets: Asset[]
  yearWiseData: YearWiseData[]
  bankDetails: BankDetails
}

export interface ReplyLetterData {
  departmentType: "INCOME_TAX" | "GST" | "CUSTOMS" | "EXCISE"
  officerName: string
  officerDesignation: string
  departmentAddress: string
  referenceNumber: string
  referenceDate: string
  subject: string
  taxpayerDetails: TaxpayerDetails
  queryPoints: QueryPoint[]
  supportingDocuments: string[]
  requestedAction: string
  submissionDeadline: string
}

export interface WealthCertificateData {
  applicantName: string
  panNumber: string
  address: Address
  assessmentYear: string
  totalWealth: number
  assets: WealthAsset[]
  liabilities: Liability[]
  netWealth: number
  previousYearWealth?: number
  certificationDate: string
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface PersonDetails {
  name: string
  fatherName: string
  address: Address
  panNumber: string
  aadharNumber: string
  dateOfBirth: string
  relationship?: string
}

export interface Partner extends PersonDetails {
  contribution: number
  profitShare: number
}

export interface Asset {
  type: string
  description: string
  value: number
  acquisitionDate: string
  location?: string
}

export interface YearWiseData {
  financialYear: string
  income: number
  expenses: number
  taxPaid: number
  refundReceived: number
  investments: number
}

export interface BankDetails {
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
  accountType: string
}

export interface TaxpayerDetails {
  name: string
  panNumber: string
  address: Address
  assessmentYear: string
  wardCircle: string
}

export interface QueryPoint {
  serialNumber: number
  query: string
  response: string
  supportingDocuments: string[]
  legalBasis?: string
}

export interface WealthAsset {
  category: string
  description: string
  value: number
  location?: string
  acquisitionDate: string
}

export interface Liability {
  type: string
  description: string
  amount: number
  creditorName: string
}

export interface CapitalContribution {
  partnerName: string
  amount: number
  date: string
  mode: string
}

export interface ProfitShare {
  partnerName: string
  percentage: number
}

export interface Witness {
  name: string
  address: Address
  occupation: string
}
