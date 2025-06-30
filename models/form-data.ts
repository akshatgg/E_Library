export interface PartnershipDeedData {
  firmName: string
  partners: Array<{
    name: string
    address: string
    contribution: number
    profitShare: number
    panNumber: string
  }>
  businessNature: string
  registrationDate: string
  duration: string
  capitalAmount: number
  bankDetails: {
    accountNumber: string
    bankName: string
    ifscCode: string
  }
}

export interface FamilySettlementDeedData {
  settlor: {
    name: string
    address: string
    panNumber: string
  }
  beneficiaries: Array<{
    name: string
    relationship: string
    share: number
    address: string
  }>
  propertyDetails: Array<{
    description: string
    value: number
    location: string
    surveyNumber?: string
  }>
  settlementDate: string
  witnessDetails: Array<{
    name: string
    address: string
  }>
}

export interface SaleDeedData {
  seller: {
    name: string
    address: string
    panNumber: string
  }
  buyer: {
    name: string
    address: string
    panNumber: string
  }
  propertyDetails: {
    description: string
    area: string
    location: string
    surveyNumber: string
    boundaries: {
      north: string
      south: string
      east: string
      west: string
    }
  }
  salePrice: number
  advanceAmount: number
  registrationDate: string
  stampDuty: number
  registrationFee: number
}

export interface HUFDeedData {
  karta: {
    name: string
    address: string
    panNumber: string
  }
  members: Array<{
    name: string
    relationship: string
    share: number
    panNumber?: string
  }>
  hufPanNumber: string
  assets: Array<{
    type: string
    description: string
    value: number
    acquisitionDate: string
  }>
  yearWiseData: Array<{
    financialYear: string
    income: number
    expenses: number
    investments: number
    distributions: number
  }>
  constitutionDate: string
}

export interface ReplyLetterData {
  departmentName: string
  officerName: string
  officerDesignation: string
  referenceNumber: string
  referenceDate: string
  subject: string
  taxpayerDetails: {
    name: string
    panNumber: string
    address: string
    assessmentYear: string
  }
  queryPoints: Array<{
    point: string
    response: string
    supportingDocuments: string[]
  }>
  requestedAction: string
  attachments: string[]
  submissionDate: string
}

export interface CashFlowStatementData {
  entityName: string
  panNumber: string
  financialYear: string
  operatingActivities: {
    netIncome: number
    depreciation: number
    accountsReceivable: number
    inventory: number
    accountsPayable: number
    other: number
  }
  investingActivities: {
    propertyPurchase: number
    equipmentPurchase: number
    investments: number
    assetSales: number
    other: number
  }
  financingActivities: {
    loanProceeds: number
    loanRepayments: number
    equityIssue: number
    dividendsPaid: number
    other: number
  }
  openingCash: number
  closingCash: number
}
