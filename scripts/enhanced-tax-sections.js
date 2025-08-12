#!/usr/bin/env node
// scripts/enhanced-tax-sections.js
/**
 * Enhanced Tax Section Diagnostic and Population Tool
 * 
 * This script helps you:
 * 1. Check if your database has cases with tax sections assigned
 * 2. Populate tax sections for cases based on content analysis
 * 3. Fix any issues with tax section filtering
 * 
 * Run with: node scripts/enhanced-tax-sections.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const readline = require('readline');

// Create readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to ask a question and get response
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Display a header with nice formatting
function displayHeader(title) {
  console.log('\n' + '='.repeat(60));
  console.log(' ' + title);
  console.log('='.repeat(60));
}

// Display section headers
function displaySection(title) {
  console.log('\n' + '-'.repeat(60));
  console.log(' ' + title);
  console.log('-'.repeat(60));
}

// Tax Section patterns and keywords
const taxSectionPatterns = [
  {
    section: "SECTION_7_GST",
    patterns: [
      'section 7',
      'section7',
      'supply',
      'classification of supply',
      'nature of supply',
      'scope of supply'
    ]
  },
  {
    section: "SECTION_16_GST",
    patterns: [
      'section 16',
      'section16',
      'input tax credit',
      'ITC',
      'credit of input tax'
    ]
  },
  {
    section: "SECTION_17_GST",
    patterns: [
      'section 17',
      'section17',
      'apportionment of credit',
      'blocked credit',
      'reversal of credit'
    ]
  },
  {
    section: "SECTION_22_24_GST",
    patterns: [
      'section 22',
      'section22',
      'section 23',
      'section23',
      'section 24',
      'section24',
      'registration',
      'registered person'
    ]
  },
  {
    section: "SECTION_31_GST",
    patterns: [
      'section 31',
      'section31',
      'tax invoice',
      'invoice',
      'bill of supply'
    ]
  },
  {
    section: "SECTION_35_36_GST",
    patterns: [
      'section 35',
      'section35',
      'section 36',
      'section36',
      'accounts',
      'records',
      'electronic records'
    ]
  },
  {
    section: "SECTION_37_39_GST",
    patterns: [
      'section 37',
      'section37',
      'section 38',
      'section38',
      'section 39',
      'section39',
      'return',
      'GSTR'
    ]
  },
  {
    section: "SECTION_49_GST",
    patterns: [
      'section 49',
      'section49',
      'payment of tax',
      'electronic cash ledger'
    ]
  },
  {
    section: "SECTION_54_GST",
    patterns: [
      'section 54',
      'section54',
      'refund'
    ]
  },
  {
    section: "SECTION_73_74_GST",
    patterns: [
      'section 73',
      'section73',
      'section 74',
      'section74',
      'determination of tax',
      'tax not paid',
      'short-paid'
    ]
  },
  {
    section: "SECTION_122_GST",
    patterns: [
      'section 122',
      'section122',
      'penalty',
      'penalties'
    ]
  },
  {
    section: "SECTION_129_GST",
    patterns: [
      'section 129',
      'section129',
      'detention',
      'seizure',
      'release of goods'
    ]
  },
  {
    section: "SECTION_140_GST",
    patterns: [
      'section 140',
      'section140',
      'transitional',
      'cenvat credit',
      'transition'
    ]
  }
];

async function checkTaxSections() {
  displayHeader('TAX SECTION DIAGNOSTIC REPORT');
  
  try {
    // Get total count of cases
    const totalCases = await prisma.caseLaw.count();
    console.log(`Total cases in database: ${totalCases}`);
    
    // Get total count of GST cases
    const totalGstCases = await prisma.caseLaw.count({
      where: {
        category: 'GST'
      }
    });
    
    console.log(`GST cases in database: ${totalGstCases}`);
    
    // Count cases with any tax section
    const casesWithTaxSection = await prisma.caseLaw.count({
      where: {
        taxSection: {
          not: null
        }
      }
    });
    
    console.log(`Cases with assigned tax section: ${casesWithTaxSection}`);
    console.log(`Cases without tax section: ${totalCases - casesWithTaxSection}`);
    
    if (casesWithTaxSection > 0) {
      const percentWithTaxSection = ((casesWithTaxSection / totalCases) * 100).toFixed(2);
      console.log(`${percentWithTaxSection}% of cases have tax sections assigned`);
    }
    
    // Get tax section distribution
    displaySection('TAX SECTION DISTRIBUTION');
    
    // Extract all tax sections from Prisma schema
    const taxSections = Object.keys(prisma.TaxSection);
    
    // Create a table for display
    console.log('TAX SECTION                 | COUNT');
    console.log('-'.repeat(60));
    
    let totalAssigned = 0;
    
    for (const section of taxSections) {
      const count = await prisma.caseLaw.count({
        where: {
          taxSection: section
        }
      });
      
      totalAssigned += count;
      const paddedSection = section.padEnd(28);
      console.log(`${paddedSection}| ${count}`);
      
      // If there are cases with this section, show a sample
      if (count > 0) {
        const sampleCase = await prisma.caseLaw.findFirst({
          where: {
            taxSection: section
          },
          select: {
            id: true,
            tid: true,
            title: true,
            category: true
          }
        });
        
        if (sampleCase) {
          console.log(`  └─ Sample: "${sampleCase.title.substring(0, 60)}..." (TID: ${sampleCase.tid}, Category: ${sampleCase.category})`);
        }
      }
    }
    
    console.log('-'.repeat(60));
    console.log(`TOTAL ASSIGNED              | ${totalAssigned}`);
    
    if (totalAssigned !== casesWithTaxSection) {
      console.log(`\n⚠️ WARNING: Mismatch between total assigned (${totalAssigned}) and cases with tax section (${casesWithTaxSection})`);
      console.log('  This could indicate cases with invalid tax section values');
    }
    
    // Check for specific section 17
    displaySection('SECTION 17 GST CASES');
    const section17Count = await prisma.caseLaw.count({
      where: {
        taxSection: 'SECTION_17_GST'
      }
    });
    
    if (section17Count > 0) {
      console.log(`Found ${section17Count} cases with Section 17 GST`);
      
      // Get and display sample cases
      const section17Cases = await prisma.caseLaw.findMany({
        where: {
          taxSection: 'SECTION_17_GST'
        },
        select: {
          id: true,
          tid: true,
          title: true,
          category: true
        },
        take: 3
      });
      
      console.log('\nSample Section 17 GST cases:');
      section17Cases.forEach((caseItem, index) => {
        console.log(`${index + 1}. "${caseItem.title.substring(0, 80)}..." (TID: ${caseItem.tid}, Category: ${caseItem.category})`);
      });
    } else {
      console.log('⚠️ No cases found with Section 17 GST');
      
      // Check if any cases might contain section 17 content
      console.log('\nSearching for potential Section 17 GST cases...');
      
      const potentialSection17Cases = await prisma.caseLaw.findMany({
        where: {
          OR: [
            { title: { contains: 'section 17', mode: 'insensitive' } },
            { title: { contains: 'section17', mode: 'insensitive' } },
            { title: { contains: 'apportionment of credit', mode: 'insensitive' } },
            { headline: { contains: 'section 17', mode: 'insensitive' } },
            { headline: { contains: 'apportionment of credit', mode: 'insensitive' } }
          ],
          category: 'GST',
          taxSection: null
        },
        select: {
          id: true,
          tid: true,
          title: true
        },
        take: 5
      });
      
      if (potentialSection17Cases.length > 0) {
        console.log(`Found ${potentialSection17Cases.length} potential Section 17 GST cases that haven't been assigned the tax section:`);
        potentialSection17Cases.forEach((caseItem, index) => {
          console.log(`${index + 1}. "${caseItem.title.substring(0, 80)}..." (TID: ${caseItem.tid})`);
        });
      } else {
        console.log('No potential Section 17 GST cases found in the database.');
      }
    }
    
  } catch (error) {
    console.error('Error checking tax sections:', error);
  }
}

async function populateTaxSections() {
  displayHeader('POPULATE TAX SECTIONS');
  console.log('This will analyze case content and assign tax sections based on keywords.');
  console.log('Only GST cases will be processed.\n');
  
  try {
    // Get count of GST cases without tax section
    const unassignedGstCases = await prisma.caseLaw.count({
      where: {
        category: 'GST',
        taxSection: null
      }
    });
    
    if (unassignedGstCases === 0) {
      console.log('✅ All GST cases already have tax sections assigned.');
      return;
    }
    
    console.log(`Found ${unassignedGstCases} GST cases without tax sections assigned.`);
    const shouldProceed = await askQuestion('Do you want to analyze and assign tax sections? (y/n): ');
    
    if (shouldProceed.toLowerCase() !== 'y') {
      console.log('Operation cancelled.');
      return;
    }
    
    // Process each tax section pattern
    console.log('\nAnalyzing cases and assigning tax sections...');
    const results = {};
    let totalUpdated = 0;
    
    for (const { section, patterns } of taxSectionPatterns) {
      process.stdout.write(`Processing ${section}... `);
      
      // Create query conditions for this section
      const conditions = patterns.map(pattern => [
        { title: { contains: pattern, mode: 'insensitive' } },
        { headline: { contains: pattern, mode: 'insensitive' } }
      ]).flat();
      
      try {
        // Count cases that match the pattern but don't have tax section set
        const matchingCases = await prisma.caseLaw.count({
          where: {
            OR: conditions,
            category: "GST",
            taxSection: null
          }
        });
        
        if (matchingCases > 0) {
          process.stdout.write(`found ${matchingCases} cases... `);
          
          // Update the cases
          const updateResult = await prisma.$executeRaw`
            UPDATE case_laws
            SET "taxSection" = ${section}::tax_section
            WHERE (${prisma.raw(
              conditions.map(cond => {
                const key = Object.keys(cond)[0];
                const { contains } = cond[key];
                return `${key} ILIKE '%${contains}%'`;
              }).join(' OR ')
            )})
            AND category = 'GST'
            AND "taxSection" IS NULL
          `;
          
          process.stdout.write(`updated ${updateResult} cases ✅\n`);
          results[section] = updateResult;
          totalUpdated += updateResult;
        } else {
          process.stdout.write('no matches found ⚠️\n');
          results[section] = 0;
        }
      } catch (error) {
        console.error(`\nError processing ${section}:`, error);
        results[section] = 'ERROR';
      }
    }
    
    // Summarize results
    displaySection('SUMMARY OF UPDATES');
    
    for (const [section, count] of Object.entries(results)) {
      console.log(`${section}: ${count} cases updated`);
    }
    
    console.log('-'.repeat(60));
    console.log(`TOTAL UPDATED: ${totalUpdated} cases`);
    
    // Verify results
    const casesWithTaxSection = await prisma.caseLaw.count({
      where: {
        taxSection: {
          not: null
        }
      }
    });
    
    console.log(`\nCases with tax section after update: ${casesWithTaxSection}`);
    
    // Check if we still have unassigned GST cases
    const remainingUnassigned = await prisma.caseLaw.count({
      where: {
        category: 'GST',
        taxSection: null
      }
    });
    
    if (remainingUnassigned > 0) {
      console.log(`\n⚠️ There are still ${remainingUnassigned} GST cases without tax sections.`);
      console.log('Consider enhancing the pattern matching or manually assigning these cases.');
    } else {
      console.log('\n✅ All GST cases now have tax sections assigned!');
    }
    
  } catch (error) {
    console.error('Error populating tax sections:', error);
  }
}

async function testSpecificTaxSection() {
  displayHeader('TEST SPECIFIC TAX SECTION');
  console.log('This will test fetching cases for a specific tax section directly from the database.');
  
  try {
    // List available tax sections
    const taxSections = Object.keys(prisma.TaxSection);
    console.log('\nAvailable tax sections:');
    taxSections.forEach((section, index) => {
      console.log(`${index + 1}. ${section}`);
    });
    
    // Ask user which section to test
    const sectionIndex = await askQuestion('\nEnter the number of the tax section to test: ');
    const selectedSection = taxSections[parseInt(sectionIndex) - 1];
    
    if (!selectedSection) {
      console.log('Invalid selection. Operation cancelled.');
      return;
    }
    
    console.log(`\nTesting direct database query for ${selectedSection}...`);
    
    // Query database directly
    const cases = await prisma.caseLaw.findMany({
      where: {
        taxSection: selectedSection
      },
      select: {
        id: true,
        tid: true,
        title: true,
        category: true,
        taxSection: true
      },
      take: 5
    });
    
    if (cases.length > 0) {
      console.log(`\n✅ Found ${cases.length} cases with tax section ${selectedSection}:`);
      cases.forEach((caseItem, index) => {
        console.log(`${index + 1}. "${caseItem.title.substring(0, 80)}..." (TID: ${caseItem.tid}, Category: ${caseItem.category})`);
      });
      
      // Test raw SQL query too (for debugging)
      console.log('\nTesting raw SQL query...');
      const rawResults = await prisma.$queryRaw`
        SELECT id, tid, title, "taxSection", category
        FROM case_laws
        WHERE "taxSection" = ${selectedSection}::tax_section
        LIMIT 5
      `;
      
      console.log(`Raw SQL found ${rawResults.length} results.`);
      
      if (rawResults.length !== cases.length) {
        console.log('⚠️ WARNING: Raw SQL query returned different number of results than Prisma query!');
      }
    } else {
      console.log(`❌ No cases found with tax section ${selectedSection}.`);
    }
    
  } catch (error) {
    console.error('Error testing tax section:', error);
  }
}

async function showMenu() {
  while (true) {
    displayHeader('TAX SECTION MANAGEMENT TOOL');
    console.log('1. Check tax section status');
    console.log('2. Populate tax sections');
    console.log('3. Test specific tax section');
    console.log('4. Exit');
    
    const choice = await askQuestion('\nEnter your choice (1-4): ');
    
    switch (choice) {
      case '1':
        await checkTaxSections();
        break;
      case '2':
        await populateTaxSections();
        break;
      case '3':
        await testSpecificTaxSection();
        break;
      case '4':
        console.log('\nExiting program. Goodbye!');
        rl.close();
        return;
      default:
        console.log('\nInvalid choice. Please try again.');
    }
    
    await askQuestion('\nPress Enter to continue...');
  }
}

// Main execution
async function main() {
  try {
    await showMenu();
  } catch (error) {
    console.error('Error in main execution:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
