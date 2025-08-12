// scripts/check-tax-sections-existence.js
/**
 * This script checks if there are cases in the database with specific tax sections.
 * 
 * Run with: node scripts/check-tax-sections-existence.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking existence of cases with specific tax sections...\n');
  
  const taxSections = [
    "SECTION_7_GST",
    "SECTION_16_GST",
    "SECTION_17_GST",
    "SECTION_22_24_GST",
    "SECTION_31_GST",
    "SECTION_35_36_GST",
    "SECTION_37_39_GST",
    "SECTION_49_GST",
    "SECTION_54_GST",
    "SECTION_73_74_GST",
    "SECTION_122_GST",
    "SECTION_129_GST",
    "SECTION_140_GST",
    "SECTION_2_IT",
    "SECTION_10_IT",
    "SECTION_14_IT",
    "SECTION_15_17_IT",
    "SECTION_28_44_IT",
    "SECTION_80C_80U_IT",
    "SECTION_139_IT",
    "SECTION_143_IT",
    "SECTION_147_IT",
    "SECTION_194_206_IT",
    "SECTION_234_IT"
  ];
  
  // Results object to store counts for each section
  const results = {};
  
  // Check each tax section
  for (const section of taxSections) {
    try {
      const count = await prisma.caseLaw.count({
        where: {
          taxSection: section
        }
      });
      
      results[section] = count;
      
      // If there are cases, get a sample
      if (count > 0) {
        const sample = await prisma.caseLaw.findFirst({
          where: {
            taxSection: section
          },
          select: {
            id: true,
            tid: true,
            title: true,
            taxSection: true
          }
        });
        
        results[`${section}_sample`] = {
          id: sample.id,
          tid: sample.tid,
          title: sample.title?.substring(0, 50) + '...',
        };
      }
    } catch (error) {
      console.error(`Error checking ${section}:`, error);
      results[section] = 'ERROR';
    }
  }
  
  // Create a formatted table for display
  console.log('Tax Section Counts:');
  console.log('==========================================');
  console.log('Tax Section                   | Count');
  console.log('------------------------------------------');
  
  for (const section of taxSections) {
    // Pad the section name to make the table align nicely
    const paddedSection = section.padEnd(28);
    console.log(`${paddedSection} | ${results[section]}`);
  }
  
  console.log('==========================================\n');
  
  // Display samples for sections with cases
  console.log('Sample Cases:');
  console.log('==========================================');
  
  let hasSamples = false;
  for (const section of taxSections) {
    if (results[section] > 0) {
      hasSamples = true;
      const sample = results[`${section}_sample`];
      console.log(`${section}:`);
      console.log(`  ID: ${sample.id}`);
      console.log(`  TID: ${sample.tid}`);
      console.log(`  Title: ${sample.title}`);
      console.log('------------------------------------------');
    }
  }
  
  if (!hasSamples) {
    console.log('No cases found with any of the tax sections.');
  }
  
  // Count total cases in database for reference
  const totalCases = await prisma.caseLaw.count();
  console.log(`\nTotal cases in database: ${totalCases}`);
  
  // Count cases with any tax section set
  const casesWithTaxSection = await prisma.caseLaw.count({
    where: {
      taxSection: {
        not: null
      }
    }
  });
  console.log(`Cases with any tax section set: ${casesWithTaxSection} (${((casesWithTaxSection / totalCases) * 100).toFixed(2)}% of total)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
