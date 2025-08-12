// scripts/populate-tax-sections.js
/**
 * This script populates tax sections for cases in the database.
 * It uses keywords and patterns to identify cases that should have specific tax sections.
 * 
 * Run with: node scripts/populate-tax-sections.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to populate tax sections...\n');
  
  // Section patterns with keywords to match
  const sectionPatterns = [
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
    // Add more patterns for other sections
  ];
  
  // Process each section pattern
  const results = {};
  
  for (const { section, patterns } of sectionPatterns) {
    console.log(`Processing ${section}...`);
    
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
      
      console.log(`Found ${matchingCases} cases matching ${section} but without taxSection set`);
      
      if (matchingCases > 0) {
        // Ask for confirmation
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise((resolve) => {
          readline.question(`Update ${matchingCases} cases with ${section}? (y/n) `, resolve);
        });
        
        if (answer.toLowerCase() === 'y') {
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
          
          console.log(`Updated ${updateResult} cases with ${section}`);
          results[section] = updateResult;
        } else {
          console.log(`Skipping update for ${section}`);
          results[section] = 0;
        }
        
        readline.close();
      } else {
        results[section] = 0;
      }
    } catch (error) {
      console.error(`Error processing ${section}:`, error);
      results[section] = 'ERROR';
    }
    
    console.log('------------------------------------------');
  }
  
  // Summarize results
  console.log('\nSummary of updates:');
  console.log('==========================================');
  let totalUpdated = 0;
  
  for (const [section, count] of Object.entries(results)) {
    console.log(`${section}: ${count}`);
    if (typeof count === 'number') {
      totalUpdated += count;
    }
  }
  
  console.log('------------------------------------------');
  console.log(`Total updated: ${totalUpdated} cases`);
  console.log('==========================================');
  
  // Verify results
  const casesWithTaxSection = await prisma.caseLaw.count({
    where: {
      taxSection: {
        not: null
      }
    }
  });
  
  console.log(`\nCases with tax section after update: ${casesWithTaxSection}`);
}

main()
  .then(async () => {
    console.log('\nTax section population completed.');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
