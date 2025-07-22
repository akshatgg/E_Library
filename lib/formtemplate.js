// formTemplates.js
// This file contains all the form templates for different departmental letters

export const formTemplates = {
  'GST Refund Application': {
    title: 'GST REFUND APPLICATION',
    generateContent: (data) => `TO,
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
Place: ${data.place || '_______________'}

Signature: _______________
Name: ${data.partnerName}
Designation: Partner`
  },

  'Income Tax Refund': {
    title: 'INCOME TAX REFUND APPLICATION',
    generateContent: (data) => `TO,
THE INCOME TAX OFFICER
WARD NO. ___
INCOME TAX DEPARTMENT

**SUBJECT: APPLICATION FOR REFUND OF EXCESS TAX PAID FOR A.Y. ${data.assYear}**

Sir/Madam,

I, ${data.partyName}, hereby submit this application for refund of excess income tax paid for the Assessment Year ${data.assYear}.

Details of Refund Claim:
1. PAN: ${data.panNumber || '_______________'}
2. Assessment Year: ${data.assYear}
3. Amount of Refund Claimed: Rs. ${data.refundAmount || '_______________'}
4. Reason for Refund: ${data.refundReason || '_______________'}

I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.

Yours faithfully,

${data.partyName}
PAN: ${data.panNumber || '_______________'}
Address: ${data.address}

Date: ${data.currentDate}
Place: ${data.place || '_______________'}`
  },

  'Property Gift Deed': {
    title: 'PROPERTY GIFT DEED',
    generateContent: (data) => `GIFT DEED

This Gift Deed is executed on ${data.currentDate} at ${data.place || '_______________'}.

BETWEEN:

${data.partyName} (Donor)
Address: ${data.address}
PAN: ${data.panNumber || '_______________'}

AND:

${data.gifteeName || '_______________'} (Donee)
Address: ${data.gifteeAddress || '_______________'}
PAN: ${data.gifteePan || '_______________'}

WHEREAS the Donor is the absolute owner of the property described below and desires to make a gift of the same to the Donee out of love and affection:

PROPERTY DESCRIPTION:
${data.propertyDescription || '_______________'}

NOW THIS DEED WITNESSETH that the Donor hereby transfers by way of gift the above described property to the Donee who accepts the same.

The Donor declares that the property is free from all encumbrances and charges.

IN WITNESS WHEREOF the parties have executed this deed on the date mentioned above.

DONOR:                           DONEE:
${data.partyName}               ${data.gifteeName || '_______________'}

Date: ${data.currentDate}
Place: ${data.place || '_______________'}

Witnesses:
1. _________________
2. _________________`
  },

  'Stay Application': {
    title: 'STAY APPLICATION',
    generateContent: (data) => `TO,
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
Place: ${data.place || '_______________'}

Enclosures:
1. Copy of Assessment Order
2. Copy of Appeal filed
3. Financial documents`
  }

  // Add more templates here as needed
  // You can manually add templates for other forms following the same structure
};

// Helper function to get available templates
export const getAvailableTemplates = () => {
  return Object.keys(formTemplates);
};

// Helper function to check if a template exists
export const hasTemplate = (formName) => {
  return formName in formTemplates;
};

// Helper function to generate form content
export const generateFormContent = (formName, data) => {
  if (!hasTemplate(formName)) {
    return null;
  }
  
  // Add current date to data if not provided
  const formData = {
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