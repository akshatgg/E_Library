// formTemplates.ts
// This file contains all the form templates for different departmental letters

export interface FormData {
  // Basic Information
  partyName?: string;
  fatherName?: string;
  address?: string;
  panNumber?: string;
  gstNumber?: string;
  email?: string;
  partnerName?: string;
  firmName?: string;
  assYear?: string;
  place?: string;
  currentDate?: string;
  
  // Financial Information
  refundAmount?: string;
  excessAmount?: string;
  actualTax?: string;
  tdsAmount?: string;
  taxLiability?: string;
  financialYear?: string;
  
  // Bank Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  
  // Office/Department Details
  wardNumber?: string;
  itOfficeAddress?: string;
  authorityName?: string;
  authorityAddress?: string;
  
  // Dates
  orderDate?: string;
  paymentDate?: string;
  challanNumber?: string;
  hearingDate?: string;
  requestedDate?: string;
  
  // Gift Deed Specific
  gifteeName?: string;
  gifteefather?: string;
  gifteeAddress?: string;
  gifteePan?: string;
  giftAmount?: string;
  giftAmountWords?: string;
  giftGiverName?: string;
  giftGiverAddress?: string;
  giftGiverPan?: string;
  relationship?: string;
  propertyDescription?: string;
  
  // Share Transfer Specific
  transfereeName?: string;
  transfereeAddress?: string;
  transfereePan?: string;
  numberOfShares?: string;
  faceValue?: string;
  companyName?: string;
  
  // Appeal/Stay Specific
  applicantType?: string;
  demandAmount?: string;
  appealOrderDate?: string;
  appealNumber?: string;
  deletedAmount?: string;
  excessPayment?: string;
  additionAmount?: string;
  errorDescription?: string;
  additionalGrounds?: string;
  appealFee?: string;
  stayOrderDate?: string;
  stayExpiryDate?: string;
  extensionPeriod?: string;
  depositPercentage?: string;
  modificationRequest?: string;
  
  // Will Specific
  age?: string;
  executorName?: string;
  residentialProperty?: string;
  residentialBeneficiary?: string;
  bankAccountBeneficiary?: string;
  otherAssets?: string;
  otherBeneficiary?: string;
  residueBeneficiaries?: string;
  originalWillDate?: string;
  clauseNumber?: string;
  newClause?: string;
  deceasedName?: string;
  deathDate?: string;
  willDate?: string;
  executorContact?: string;
  
  // Error/Rectification Specific
  mistakeDescription?: string;
  correctPosition?: string;
  errorDetails?: string;
  supportingDocs?: string;
  computationError?: string;
  correctComputation?: string;
  
  // Partnership/Trust Specific
  partner1Name?: string;
  partner1Address?: string;
  partner1Pan?: string;
  partner1Capital?: string;
  partner2Name?: string;
  partner2Address?: string;
  partner2Pan?: string;
  partner2Capital?: string;
  businessNature?: string;
  businessAddress?: string;
  profitRatio?: string;
  partnershipDuration?: string;
  
  // Authority Specific
  authorizeeName?: string;
  authorityPurpose?: string;
  validTill?: string;
  validFrom?: string;
  powers?: string;
  authorizationPurpose?: string;
  authorizationScope?: string;
  
  // Calculation Specific
  salaryIncome?: string;
  housePropertyIncome?: string;
  businessIncome?: string;
  capitalGains?: string;
  otherIncome?: string;
  totalIncome?: string;
  deduction80C?: string;
  deduction80D?: string;
  otherDeductions?: string;
  taxableIncome?: string;
  taxCalculation?: string;
  principalAmount?: string;
  interestRate?: string;
  fromDate?: string;
  toDate?: string;
  interestCalculation?: string;
  totalInterest?: string;
  baseAmount?: string;
  penaltyRate?: string;
  penaltyCalculation?: string;
  totalPenalty?: string;
  
  // Affidavit Specific
  statement1?: string;
  statement2?: string;
  statement3?: string;
  annualIncome?: string;
  declarationDate?: string;
  immovableProperty?: string;
  movableProperty?: string;
  bankAccounts?: string;
  investments?: string;
  
  // Trust Specific
  settlorName?: string;
  settlorAddress?: string;
  trustee1Name?: string;
  trustee2Name?: string;
  trustName?: string;
  trustObjects?: string;
  trustProperty?: string;
  trusteePowers?: string;
  
  // General Purpose
  reason?: string;
  purpose?: string;
  recipientName?: string;
  recipientAddress?: string;
  applicationSubject?: string;
  applicationContent?: string;
  requestSubject?: string;
  requestContent?: string;
  informationRequested?: string;
  informationPurpose?: string;
  adjournmentReason?: string;
  extensionReason?: string;
  postponementReason?: string;
  eventName?: string;
  scheduledDate?: string;
  returnFilingDate?: string;
  processingDate?: string;
  returnIncome?: string;
  returnTax?: string;
  taxPaid?: string;
  refundDemand?: string;
  reassessmentReason?: string;
  additionalInfo?: string;
  
  // Amendment Specific
  originalDeedType?: string;
  originalDeedDate?: string;
  parties?: string;
  amendments?: string;
  partySignatures?: string;
  
  // Other fields as needed
  [key: string]: string | undefined;
}

export interface FormTemplate {
  title: string;
  generateContent: (data: FormData) => string;
}

export interface GeneratedForm {
  title: string;
  content: string;
}

export const formTemplates: Record<string, FormTemplate> = {
  // REFUND CATEGORY
  'GST Refund Application': {
    title: 'GST REFUND APPLICATION',
    generateContent: (data: FormData) => `TO,
THE ASST. COMMISSIONER
GOODS & SERVICE TAX BIKRI KAR BHAWAN
WARD NO. 74 NEW DELHI,

**REF GST NO. ${data.gstNumber || '_______________________'}**

**SUBJECT: REFUND OF GST AMT. FOR THE FIRST QUARTER 2017-18**

DEAR SIR,

With Respect to the GST NO. ${data.gstNumber || '_________________'} and as required by you. I ${data.partnerName} Partner of the above Firm herewith Submitting the following facts and undertaking in support of this

A) Cancelled Cheque
B) Copy of Bank Statement Showing Proof of Payment
C) I Declare Under Section 54(3)(iii) that refund of ITC claimed does not include ITC availed on goods and services used for making NIL rated or fully Exempt Supplies.
D) I further undertake that the amount of refund Sanctioned will be paid back to the Government with interest whenever is found subsequently that the requirement of clause (C) of Sub Section (2) of Section 16 read with Sub Section (2) of Section 42 of the CGST/SGST have been complied with respect of amount refunded.
E) I Certify That This Claim Of Refund Has Not Been Preferred To Central Or Any Other Authority.

That I **${data.partnerName}** Solemnly affirm and declare as under that the information given above true and correct as per Para (a) to (e) and nothing has been Concealed there from.

I further declare that no Refund amount for this period received by me till the date.

For ${data.firmName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Signature: _______________
Name: ${data.partnerName}
Designation: Partner`
  },

  'Income Tax Refund': {
    title: 'INCOME TAX REFUND APPLICATION',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}
INCOME TAX DEPARTMENT
${data.itOfficeAddress || 'NEW DELHI'}

**SUBJECT: APPLICATION FOR REFUND OF EXCESS TAX PAID FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I, ${data.partyName}, PAN: ${data.panNumber || '_______________'}, respectfully submit that:

1. I have filed my Income Tax Return for A.Y. ${data.assYear} and the same has been processed.

2. As per the processing, there is an excess payment of Rs. ${data.refundAmount || '_______________'} made towards Income Tax.

3. I request you to kindly process my refund claim and credit the amount to my bank account details as follows:

   Bank Name: ${data.bankName || '_______________'}
   Account No: ${data.accountNumber || '_______________'}
   IFSC Code: ${data.ifscCode || '_______________'}

4. All supporting documents are enclosed herewith.

I request you to kindly process my refund at the earliest.

Thanking you,

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}
Address: ${data.address}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Enclosures:
1. Copy of ITR Filed
2. Copy of Processing Order
3. Bank Account Details`
  },

  'Excess Payment Refund': {
    title: 'EXCESS PAYMENT REFUND APPLICATION',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}
${data.itOfficeAddress || 'NEW DELHI'}

**SUBJECT: REFUND OF EXCESS PAYMENT FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

With reference to my PAN ${data.panNumber || '_______________'}, I would like to bring to your kind notice that:

1. I have made excess payment of Rs. ${data.excessAmount || '_______________'} towards Income Tax for A.Y. ${data.assYear}.

2. The excess payment was made vide Challan No. ${data.challanNumber || '_______________'} dated ${data.paymentDate || '_______________'}.

3. As per the assessment completed, my actual tax liability is Rs. ${data.actualTax || '_______________'}.

4. Therefore, I am entitled for refund of Rs. ${data.refundAmount || '_______________'}.

I request you to kindly process the refund and credit to my bank account.

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'TDS Refund Application': {
    title: 'TDS REFUND APPLICATION',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
TDS CELL
${data.itOfficeAddress || 'NEW DELHI'}

**SUBJECT: REFUND OF EXCESS TDS DEDUCTED FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I, ${data.partyName}, PAN: ${data.panNumber || '_______________'}, submit that:

1. TDS of Rs. ${data.tdsAmount || '_______________'} has been deducted from my income during F.Y. ${data.financialYear || '_______________'}.

2. As per my Income Tax Return filed for A.Y. ${data.assYear}, my total tax liability is Rs. ${data.taxLiability || '_______________'}.

3. After adjusting advance tax and self-assessment tax, I am entitled for TDS refund of Rs. ${data.refundAmount || '_______________'}.

4. Form 16/16A and other supporting documents are enclosed.

I request you to process my TDS refund claim at the earliest.

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Enclosures:
1. Form 16/16A
2. Copy of ITR
3. Bank Account Details`
  },

  // GIFT DEED CATEGORY
  'Property Gift Deed': {
    title: 'PROPERTY GIFT DEED',
    generateContent: (data: FormData) => `GIFT DEED

THIS DEED OF GIFT is made on this ${data.currentDate} between:

DONOR: ${data.partyName}
S/o: ${data.fatherName || '_______________'}
Address: ${data.address}
PAN: ${data.panNumber || '_______________'}
                                        (Party of the First Part)
AND

DONEE: ${data.gifteeName || '_______________'}
S/o: ${data.gifteefather || '_______________'}
Address: ${data.gifteeAddress || '_______________'}
PAN: ${data.gifteePan || '_______________'}
                                        (Party of the Second Part)

WHEREAS the Donor is the absolute owner of the property described in Schedule hereunder and desires to make a gift of the same to the Donee out of love and affection.

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. The Donor hereby transfers by way of gift the property described in the Schedule to the Donee.

2. The Donee hereby accepts the gift of the said property.

3. The property is transferred free from all encumbrances.

SCHEDULE OF PROPERTY:
${data.propertyDescription || 'Property details to be filled'}

IN WITNESS WHEREOF the parties have executed this deed on the date first written above.

DONOR:                           DONEE:
${data.partyName}               ${data.gifteeName || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Witnesses:
1. _________________          2. _________________`
  },

  'Cash Gift Declaration': {
    title: 'CASH GIFT DECLARATION',
    generateContent: (data: FormData) => `CASH GIFT DECLARATION

I, ${data.partyName}, S/o ${data.fatherName || '_______________'}, residing at ${data.address}, PAN: ${data.panNumber || '_______________'}, hereby declare that:

1. I have received a cash gift of Rs. ${data.giftAmount || '_______________'} (Rupees ${data.giftAmountWords || '_______________'} only) from ${data.giftGiverName || '_______________'}.

2. The relationship between me and the gift giver is ${data.relationship || '_______________'}.

3. This gift has been received out of love and affection without any consideration.

4. The gift giver's details are as follows:
   Name: ${data.giftGiverName || '_______________'}
   Address: ${data.giftGiverAddress || '_______________'}
   PAN: ${data.giftGiverPan || '_______________'}

5. This declaration is made for Income Tax purposes under Section 56(2)(x) of the Income Tax Act, 1961.

I declare that the above information is true and correct.

Signature: _______________
Name: ${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Witness:
Name: _______________
Signature: _______________`
  },

  'Share Gift Transfer': {
    title: 'SHARE GIFT TRANSFER DEED',
    generateContent: (data: FormData) => `SHARE GIFT TRANSFER DEED

This Deed is executed on ${data.currentDate} between:

TRANSFEROR: ${data.partyName}
Address: ${data.address}
PAN: ${data.panNumber || '_______________'}

TRANSFEREE: ${data.transfereeName || '_______________'}
Address: ${data.transfereeAddress || '_______________'}
PAN: ${data.transfereePan || '_______________'}

WHEREAS the Transferor is the holder of ${data.numberOfShares || '___'} equity shares of ${data.companyName || '_______________'} and desires to gift the same to the Transferee.

NOW THEREFORE, the Transferor hereby gifts ${data.numberOfShares || '___'} equity shares of face value Rs. ${data.faceValue || '___'} each in ${data.companyName || '_______________'} to the Transferee out of love and affection.

The Transferee accepts the gift of the said shares.

Transferor:                    Transferee:
${data.partyName}             ${data.transfereeName || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // STAY CATEGORY
  'Stay Application': {
    title: 'STAY APPLICATION',
    generateContent: (data: FormData) => `TO,
THE HONOURABLE ${data.authorityName || 'COMMISSIONER OF INCOME TAX (APPEALS)'}
${data.authorityAddress || 'NEW DELHI'}

**SUBJECT: APPLICATION FOR STAY OF DEMAND FOR A.Y. ${data.assYear}**

RESPECTFULLY SHEWETH:

1. That the applicant ${data.partyName} is a ${data.applicantType || 'Individual'} having PAN ${data.panNumber || '_______________'}.

2. That the Assessing Officer has raised a demand of Rs. ${data.demandAmount || '_______________'} for A.Y. ${data.assYear} vide order dated ${data.orderDate || '_______________'}.

3. That the applicant has filed an appeal against the said order and the same is pending adjudication.

4. That the demand raised is excessive and without proper basis as detailed in the appeal.

5. That the applicant will suffer irreparable hardship if the demand is not stayed pending disposal of the appeal.

PRAYER:

It is therefore most respectfully prayed that this Hon'ble Authority may be pleased to:

a) Stay the operation of demand raised for A.Y. ${data.assYear}
b) Grant any other relief as deemed fit

AND YOUR PETITIONER SHALL EVER PRAY.

${data.partyName}
PAN: ${data.panNumber || '_______________'}
Address: ${data.address}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Enclosures:
1. Copy of Assessment Order
2. Copy of Appeal filed
3. Financial documents`
  },

  'Stay Extension Request': {
    title: 'STAY EXTENSION REQUEST',
    generateContent: (data: FormData) => `TO,
THE HONOURABLE ${data.authorityName || 'COMMISSIONER OF INCOME TAX (APPEALS)'}

**SUBJECT: APPLICATION FOR EXTENSION OF STAY FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

With reference to the stay granted vide order dated ${data.stayOrderDate || '_______________'} for A.Y. ${data.assYear}, I respectfully submit:

1. That stay was granted for a period expiring on ${data.stayExpiryDate || '_______________'}.

2. That the appeal is still pending adjudication before your good office.

3. That due to voluminous nature of the case, more time is required for final disposal.

4. That if stay is not extended, the applicant will suffer irreparable loss.

I therefore request for extension of stay for a further period of ${data.extensionPeriod || '6 months'} or till disposal of appeal, whichever is earlier.

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Stay Modification': {
    title: 'STAY MODIFICATION APPLICATION',
    generateContent: (data: FormData) => `TO,
THE HONOURABLE ${data.authorityName || 'COMMISSIONER OF INCOME TAX (APPEALS)'}

**SUBJECT: APPLICATION FOR MODIFICATION OF STAY CONDITIONS FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

With reference to the conditional stay granted vide order dated ${data.stayOrderDate || '_______________'}, I submit:

1. That stay was granted subject to deposit of ${data.depositPercentage || '20'}% of the demand amount.

2. That due to financial hardship, compliance with the condition is difficult.

3. That the case has strong merits as evident from the appeal filed.

I request modification of stay conditions to:
${data.modificationRequest || 'Reduce deposit amount to 10% of demand'}

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // APPEAL EFFECT CATEGORY
  'Appeal Filing': {
    title: 'APPEAL BEFORE CIT(A)',
    generateContent: (data: FormData) => `TO,
THE COMMISSIONER OF INCOME TAX (APPEALS)
${data.appealOrderDate || 'NEW DELHI'}

**APPEAL UNDER SECTION 246A OF THE INCOME TAX ACT, 1961**

Appellant: ${data.partyName}
PAN: ${data.panNumber || '_______________'}
A.Y.: ${data.assYear}

GROUNDS OF APPEAL:

1. That the order passed by the Assessing Officer is bad in law and contrary to facts.

2. That the addition of Rs. ${data.additionAmount || '_______________'} is unjustified and without basis.

3. That the Assessing Officer has erred in ${data.errorDescription || 'not considering the submissions made'}.

4. That the penalty levied is not sustainable in law.

${data.additionalGrounds || ''}

PRAYER:

It is therefore prayed that this Hon'ble Authority may be pleased to:

a) Delete the addition of Rs. ${data.additionAmount || '_______________'}
b) Cancel the penalty imposed
c) Grant any other relief deemed fit

VERIFICATION:

I, ${data.partyName}, verify that the contents of the appeal are true to my knowledge.

${data.partyName}
Appellant

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Fee paid: Rs. ${data.appealFee || '250'} vide Challan No. ${data.challanNumber || '_______________'}`
  },

  'Appeal Effect Request': {
    title: 'APPEAL EFFECT REQUEST',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: REQUEST FOR GIVING EFFECT TO CIT(A) ORDER FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

With reference to the order dated ${data.appealOrderDate || '_______________'} passed by CIT(A) in Appeal No. ${data.appealNumber || '_______________'} for A.Y. ${data.assYear}, I submit:

1. That the CIT(A) has deleted the addition of Rs. ${data.deletedAmount || '_______________'}.

2. That consequent to the above, excess payment of Rs. ${data.excessPayment || '_______________'} has been made.

3. That the appeal effect has not been given so far.

I request you to kindly give effect to the CIT(A) order and process the refund of Rs. ${data.refundAmount || '_______________'}.

Copy of CIT(A) order is enclosed.

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Enclosure: Copy of CIT(A) Order`
  },

  'Cross Appeal': {
    title: 'CROSS APPEAL',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX APPELLATE TRIBUNAL
${data.authorityAddress || 'NEW DELHI'}

**CROSS APPEAL UNDER SECTION 253 OF THE INCOME TAX ACT, 1961**

Cross Appellant: ${data.partyName}
Respondent: ACIT/DCIT, Ward ${data.wardNumber || '___'}
A.Y.: ${data.assYear}
CIT(A) Appeal No.: ${data.appealNumber || '_______________'}

GROUNDS OF CROSS APPEAL:

1. That the CIT(A) erred in confirming the addition of Rs. ${data.additionAmount || '_______________'}.

2. That the CIT(A) failed to appreciate the legal position regarding ${data.errorDescription || '_______________'}.

3. That the order of CIT(A) is contrary to established judicial precedents.

${data.additionalGrounds || ''}

PRAYER:

It is prayed that this Hon'ble Tribunal may be pleased to delete the addition confirmed by CIT(A).

${data.partyName}
Cross Appellant

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // WILL DEED CATEGORY
  'Will Registration': {
    title: 'LAST WILL AND TESTAMENT',
    generateContent: (data: FormData) => `LAST WILL AND TESTAMENT

I, ${data.partyName}, S/o ${data.fatherName || '_______________'}, aged ${data.age || '___'} years, residing at ${data.address}, being of sound mind and memory, do hereby revoke all former Wills and Codicils made by me and declare this to be my Last Will and Testament.

1. I appoint ${data.executorName || '_______________'} as the Executor of this Will.

2. I direct that all my just debts and funeral expenses be paid.

3. I bequeath my properties as follows:

   a) Residential Property: ${data.residentialProperty || '_______________'} to ${data.residentialBeneficiary || '_______________'}
   
   b) Bank Accounts: All bank accounts to ${data.bankAccountBeneficiary || '_______________'}
   
   c) Other Assets: ${data.otherAssets || '_______________'} to ${data.otherBeneficiary || '_______________'}

4. The residue of my estate to be distributed equally among ${data.residueBeneficiaries || '_______________'}.

5. This Will shall be governed by Indian laws.

IN WITNESS WHEREOF, I have set my hand on this ${data.currentDate}.

TESTATOR:
${data.partyName}

WITNESSES:
1. _______________     2. _______________

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Will Amendment': {
    title: 'CODICIL TO WILL',
    generateContent: (data: FormData) => `CODICIL TO THE LAST WILL AND TESTAMENT

I, ${data.partyName}, having made my Last Will and Testament dated ${data.originalWillDate || '_______________'}, do hereby make this Codicil.

WHEREAS I desire to make certain amendments to my said Will:

1. I hereby revoke Clause ${data.clauseNumber || '___'} of my Will.

2. I substitute the said clause with the following:
   "${data.newClause || '_______________'}"

3. In all other respects, I confirm my said Will.

This Codicil shall be read as part of my Will.

${data.partyName}
Testator

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Witnesses:
1. _______________     2. _______________`
  },

  'Will Execution': {
    title: 'WILL EXECUTION NOTICE',
    generateContent: (data: FormData) => `NOTICE OF WILL EXECUTION

TO ALL CONCERNED,

Notice is hereby given that ${data.deceasedName || '_______________'}, who died on ${data.deathDate || '_______________'}, had executed a Will dated ${data.willDate || '_______________'}.

As per the said Will, ${data.executorName || '_______________'} has been appointed as the Executor.

All persons having claims against the estate are required to submit the same within 30 days.

All beneficiaries named in the Will are requested to contact the undersigned.

${data.executorName || '_______________'}
Executor

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Contact: ${data.executorContact || '_______________'}`
  },

  // 154 APPLICATION CATEGORY
  'Rectification Application': {
    title: 'RECTIFICATION APPLICATION UNDER SECTION 154',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: APPLICATION FOR RECTIFICATION UNDER SECTION 154 FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I, ${data.partyName}, PAN: ${data.panNumber || '_______________'}, submit that there is a mistake apparent from record in the assessment order dated ${data.orderDate || '_______________'} for A.Y. ${data.assYear}.

The mistake is as follows:
${data.mistakeDescription || '_______________'}

The correct position should be:
${data.correctPosition || '_______________'}

I request you to rectify the mistake under Section 154 of the Income Tax Act.

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Error Correction': {
    title: 'ERROR CORRECTION APPLICATION',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: CORRECTION OF ERROR IN ASSESSMENT ORDER FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

With reference to the assessment order dated ${data.orderDate || '_______________'}, I submit that there is an apparent error which needs correction.

Error Details:
${data.errorDetails || '_______________'}

Supporting Documents:
${data.supportingDocs || '_______________'}

I request immediate correction of the error.

Yours faithfully,

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Computational Error': {
    title: 'COMPUTATIONAL ERROR RECTIFICATION',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: RECTIFICATION OF COMPUTATIONAL ERROR FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

There is a computational error in the assessment order dated ${data.orderDate || '_______________'}.

Error in Computation:
${data.computationError || '_______________'}

Correct Computation:
${data.correctComputation || '_______________'}

I request rectification of the computational error.

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // EARLY FIXATION CATEGORY
  'Early Assessment': {
    title: 'EARLY ASSESSMENT REQUEST',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: REQUEST FOR EARLY ASSESSMENT FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I request early completion of assessment for A.Y. ${data.assYear} due to ${data.reason || 'urgent business requirements'}.

All documents are ready and available for scrutiny.

I undertake to cooperate fully for early completion.

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Fixation Request': {
    title: 'FIXATION REQUEST',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: REQUEST FOR FIXATION OF HEARING DATE FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I request fixation of hearing date for assessment proceedings for A.Y. ${data.assYear}.

I am ready with all documents and request early fixation.

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Timeline Extension': {
    title: 'TIMELINE EXTENSION REQUEST',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: REQUEST FOR EXTENSION OF TIME FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I request extension of time for ${data.purpose || 'submission of documents'} for A.Y. ${data.assYear}.

Reason for extension: ${data.extensionReason || '_______________'}

I request extension till ${data.requestedDate || '_______________'}.

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // AUTHORITY CATEGORY
  'Authority Letter': {
    title: 'AUTHORITY LETTER',
    generateContent: (data: FormData) => `AUTHORITY LETTER

I, ${data.partyName}, PAN: ${data.panNumber || '_______________'}, hereby authorize ${data.authorizeeName || '_______________'} to:

${data.authorityPurpose || '_______________'}

This authority is valid till ${data.validTill || '_______________'}.

${data.partyName}
Signature

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Power of Attorney': {
    title: 'POWER OF ATTORNEY',
    generateContent: (data: FormData) => `POWER OF ATTORNEY

I, ${data.partyName}, S/o ${data.fatherName || '_______________'}, hereby appoint ${data.authorizeeName || '_______________'} as my attorney to:

${data.powers || '_______________'}

This Power of Attorney is valid from ${data.validFrom || '_______________'} to ${data.validTill || '_______________'}.

${data.partyName}
Principal

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Witnesses:
1. _______________     2. _______________`
  },

  'Authorization Form': {
    title: 'AUTHORIZATION FORM',
    generateContent: (data: FormData) => `AUTHORIZATION FORM

I, ${data.partyName}, hereby authorize ${data.authorizeeName || '_______________'} to act on my behalf for:

${data.authorizationPurpose || '_______________'}

Scope of Authorization: ${data.authorizationScope || '_______________'}

Valid till: ${data.validTill || '_______________'}

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // GENERAL CATEGORY
  'General Application': {
    title: 'GENERAL APPLICATION',
    generateContent: (data: FormData) => `TO,
${data.recipientName || 'THE CONCERNED OFFICER'}
${data.recipientAddress || '_______________'}

**SUBJECT: ${data.applicationSubject || '_______________'}**

Respected Sir/Madam,

${data.applicationContent || '_______________'}

I request your kind consideration and necessary action.

Yours faithfully,

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Miscellaneous Request': {
    title: 'MISCELLANEOUS REQUEST',
    generateContent: (data: FormData) => `TO,
${data.recipientName || 'THE CONCERNED AUTHORITY'}

**SUBJECT: ${data.requestSubject || '_______________'}**

Respected Sir/Madam,

${data.requestContent || '_______________'}

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Information Request': {
    title: 'INFORMATION REQUEST',
    generateContent: (data: FormData) => `TO,
${data.recipientName || 'THE INFORMATION OFFICER'}

**SUBJECT: REQUEST FOR INFORMATION UNDER RTI ACT**

Respected Sir/Madam,

I request the following information:
${data.informationRequested || '_______________'}

Purpose: ${data.informationPurpose || '_______________'}

${data.partyName}
Address: ${data.address}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // CALCULATION CATEGORY
  'Tax Calculation': {
    title: 'TAX CALCULATION WORKSHEET',
    generateContent: (data: FormData) => `TAX CALCULATION FOR A.Y. ${data.assYear}

Name: ${data.partyName}
PAN: ${data.panNumber || '_______________'}

COMPUTATION OF INCOME:

1. Salary Income: Rs. ${data.salaryIncome || '0'}
2. House Property Income: Rs. ${data.housePropertyIncome || '0'}
3. Business Income: Rs. ${data.businessIncome || '0'}
4. Capital Gains: Rs. ${data.capitalGains || '0'}
5. Other Sources: Rs. ${data.otherIncome || '0'}

Total Income: Rs. ${data.totalIncome || '0'}

Less: Deductions under Chapter VI-A
80C: Rs. ${data.deduction80C || '0'}
80D: Rs. ${data.deduction80D || '0'}
Others: Rs. ${data.otherDeductions || '0'}

Taxable Income: Rs. ${data.taxableIncome || '0'}

Tax Calculation:
${data.taxCalculation || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Interest Calculation': {
    title: 'INTEREST CALCULATION',
    generateContent: (data: FormData) => `INTEREST CALCULATION FOR A.Y. ${data.assYear}

Name: ${data.partyName}
PAN: ${data.panNumber || '_______________'}

Principal Amount: Rs. ${data.principalAmount || '_______________'}
Rate of Interest: ${data.interestRate || '___'}% per annum
Period: From ${data.fromDate || '_______________'} to ${data.toDate || '_______________'}

Calculation:
${data.interestCalculation || '_______________'}

Total Interest: Rs. ${data.totalInterest || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Penalty Calculation': {
    title: 'PENALTY CALCULATION',
    generateContent: (data: FormData) => `PENALTY CALCULATION FOR A.Y. ${data.assYear}

Name: ${data.partyName}
PAN: ${data.panNumber || '_______________'}

Base Amount: Rs. ${data.baseAmount || '_______________'}
Penalty Rate: ${data.penaltyRate || '___'}%

Calculation:
${data.penaltyCalculation || '_______________'}

Total Penalty: Rs. ${data.totalPenalty || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // ADJOURNMENT CATEGORY
  'Hearing Adjournment': {
    title: 'HEARING ADJOURNMENT REQUEST',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: REQUEST FOR ADJOURNMENT OF HEARING FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

The hearing in my case is fixed on ${data.hearingDate || '_______________'}. I request adjournment due to ${data.adjournmentReason || '_______________'}.

I request the hearing to be rescheduled to ${data.requestedDate || '_______________'}.

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Date Extension': {
    title: 'DATE EXTENSION REQUEST',
    generateContent: (data: FormData) => `TO,
THE CONCERNED OFFICER

**SUBJECT: REQUEST FOR EXTENSION OF DATE**

Respected Sir/Madam,

I request extension of date for ${data.purpose || '_______________'} from ${data.scheduledDate || '_______________'} to ${data.requestedDate || '_______________'}.

Reason: ${data.extensionReason || '_______________'}

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Postponement Request': {
    title: 'POSTPONEMENT REQUEST',
    generateContent: (data: FormData) => `TO,
${data.recipientName || 'THE CONCERNED AUTHORITY'}

**SUBJECT: REQUEST FOR POSTPONEMENT**

Respected Sir/Madam,

I request postponement of ${data.eventName || '_______________'} scheduled on ${data.scheduledDate || '_______________'}.

Reason for postponement: ${data.postponementReason || '_______________'}

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // AFFIDAVIT CATEGORY
  'General Affidavit': {
    title: 'AFFIDAVIT',
    generateContent: (data: FormData) => `AFFIDAVIT

I, ${data.partyName}, S/o ${data.fatherName || '_______________'}, aged ${data.age || '___'} years, residing at ${data.address}, do hereby solemnly affirm and declare as under:

1. ${data.statement1 || '_______________'}

2. ${data.statement2 || '_______________'}

3. ${data.statement3 || '_______________'}

I further declare that the above statements are true to the best of my knowledge and belief.

DEPONENT
${data.partyName}

VERIFICATION:
I, the above named deponent, do hereby verify that the contents of this affidavit are true to the best of my knowledge and belief.

Verified at ${data.place || 'Fatehpur'} on this ${data.currentDate}.

DEPONENT
${data.partyName}`
  },

  'Income Affidavit': {
    title: 'INCOME AFFIDAVIT',
    generateContent: (data: FormData) => `INCOME AFFIDAVIT

I, ${data.partyName}, S/o ${data.fatherName || '_______________'}, residing at ${data.address}, do hereby solemnly affirm and declare as under:

1. That my annual income for F.Y. ${data.financialYear || '_______________'} is Rs. ${data.annualIncome || '_______________'}.

2. That the sources of my income are:
   a) Salary: Rs. ${data.salaryIncome || '0'}
   b) Business: Rs. ${data.businessIncome || '0'}
   c) Other Sources: Rs. ${data.otherIncome || '0'}

3. That I have filed my Income Tax Return for A.Y. ${data.assYear} showing the above income.

4. That the above statements are true to the best of my knowledge.

DEPONENT
${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Asset Declaration': {
    title: 'ASSET DECLARATION AFFIDAVIT',
    generateContent: (data: FormData) => `ASSET DECLARATION AFFIDAVIT

I, ${data.partyName}, do hereby declare my assets as on ${data.declarationDate || data.currentDate}:

IMMOVABLE PROPERTY:
${data.immovableProperty || '_______________'}

MOVABLE PROPERTY:
${data.movableProperty || '_______________'}

BANK ACCOUNTS:
${data.bankAccounts || '_______________'}

INVESTMENTS:
${data.investments || '_______________'}

I declare that the above information is true and complete.

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // PARTNERSHIP/TRUST DEED CATEGORY
  'Partnership Deed': {
    title: 'PARTNERSHIP DEED',
    generateContent: (data: FormData) => `PARTNERSHIP DEED

This Partnership Deed is executed on ${data.currentDate} between:

FIRST PARTNER: ${data.partner1Name || '_______________'}
Address: ${data.partner1Address || '_______________'}
PAN: ${data.partner1Pan || '_______________'}

SECOND PARTNER: ${data.partner2Name || '_______________'}
Address: ${data.partner2Address || '_______________'}
PAN: ${data.partner2Pan || '_______________'}

TERMS AND CONDITIONS:

1. Name of Partnership: ${data.firmName}
2. Business: ${data.businessNature || '_______________'}
3. Principal Place of Business: ${data.businessAddress || '_______________'}

CAPITAL CONTRIBUTION:
- ${data.partner1Name || 'First Partner'}: Rs. ${data.partner1Capital || '_______________'}
- ${data.partner2Name || 'Second Partner'}: Rs. ${data.partner2Capital || '_______________'}

PROFIT SHARING RATIO: ${data.profitRatio || '50:50'}

DURATION: ${data.partnershipDuration || 'Till mutually decided'}

IN WITNESS WHEREOF the parties have executed this deed.

${data.partner1Name || 'FIRST PARTNER'}          ${data.partner2Name || 'SECOND PARTNER'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}

Witnesses:
1. _______________     2. _______________`
  },

  'Trust Formation': {
    title: 'TRUST DEED',
    generateContent: (data: FormData) => `TRUST DEED

This Trust Deed is executed on ${data.currentDate} by:

SETTLOR: ${data.settlorName || '_______________'}
Address: ${data.settlorAddress || '_______________'}

IN FAVOUR OF:

TRUSTEES:
1. ${data.trustee1Name || '_______________'}
2. ${data.trustee2Name || '_______________'}

NAME OF TRUST: ${data.trustName || '_______________'}

OBJECTS OF TRUST:
${data.trustObjects || '_______________'}

TRUST PROPERTY:
${data.trustProperty || '_______________'}

POWERS OF TRUSTEES:
${data.trusteePowers || '_______________'}

SETTLOR                    TRUSTEES
${data.settlorName || '_______________'}    1. ${data.trustee1Name || '_______________'}
                           2. ${data.trustee2Name || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Deed Amendment': {
    title: 'DEED AMENDMENT',
    generateContent: (data: FormData) => `AMENDMENT TO ${data.originalDeedType || 'DEED'}

This Amendment is made on ${data.currentDate} to the ${data.originalDeedType || 'Deed'} dated ${data.originalDeedDate || '_______________'}.

PARTIES: ${data.parties || '_______________'}

AMENDMENTS:
${data.amendments || '_______________'}

All other terms of the original deed remain unchanged.

PARTIES:
${data.partySignatures || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  // ASSESSMENT CATEGORY
  'Self Assessment': {
    title: 'SELF ASSESSMENT STATEMENT',
    generateContent: (data: FormData) => `SELF ASSESSMENT STATEMENT FOR A.Y. ${data.assYear}

Name: ${data.partyName}
PAN: ${data.panNumber || '_______________'}

I hereby assess my income and tax liability as follows:

Total Income: Rs. ${data.totalIncome || '_______________'}
Tax Payable: Rs. ${data.taxLiability || '_______________'}
TDS/Advance Tax: Rs. ${data.taxPaid || '_______________'}
Balance Tax Payable: Rs. ${data.refundDemand || '_______________'}

I declare that the assessment is correct.

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Return Assessment': {
    title: 'RETURN ASSESSMENT STATEMENT',
    generateContent: (data: FormData) => `RETURN ASSESSMENT FOR A.Y. ${data.assYear}

Assessee: ${data.partyName}
PAN: ${data.panNumber || '_______________'}

Return Filed on: ${data.returnFilingDate || '_______________'}
Processing Date: ${data.processingDate || '_______________'}

Assessment Summary:
Total Income as per Return: Rs. ${data.returnIncome || '_______________'}
Tax as per Return: Rs. ${data.returnTax || '_______________'}
Tax Paid: Rs. ${data.taxPaid || '_______________'}
Refund/Demand: Rs. ${data.refundDemand || '_______________'}

${data.partyName}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  },

  'Reassessment Application': {
    title: 'REASSESSMENT APPLICATION',
    generateContent: (data: FormData) => `TO,
THE INCOME TAX OFFICER
WARD NO. ${data.wardNumber || '___'}

**SUBJECT: APPLICATION FOR REASSESSMENT FOR A.Y. ${data.assYear}**

Respected Sir/Madam,

I request reassessment for A.Y. ${data.assYear} due to ${data.reassessmentReason || '_______________'}.

Additional Information:
${data.additionalInfo || '_______________'}

Supporting Documents:
${data.supportingDocs || '_______________'}

${data.partyName}
PAN: ${data.panNumber || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || 'Fatehpur'}`
  }
};

// Helper function to get available templates
export const getAvailableTemplates = (): string[] => {
  return Object.keys(formTemplates);
};

// Helper function to check if a template exists
export const hasTemplate = (formName: string): boolean => {
  return formName in formTemplates;
};

// Helper function to generate form content
export const generateFormContent = (formName: string, data: FormData): GeneratedForm | null => {
  if (!hasTemplate(formName)) {
    return null;
  }
  
  // Add current date to data if not provided
  const formData: FormData = {
    ...data,
    currentDate: data.currentDate || new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  };
  
  return {
    title: formTemplates[formName].title,
    content: formTemplates[formName].generateContent(formData)
  };
};
