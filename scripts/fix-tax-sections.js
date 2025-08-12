// scripts/fix-tax-sections.js
/**
 * This script checks for tax sections in the database and updates cases that match
 * section 17 criteria but don't have the correct taxSection value.
 * 
 * Run with: node scripts/fix-tax-sections.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting tax section check and update...');
  
  // 1. Check current taxSection values in the database
  console.log('\n1. Current taxSection values in database:');
  try {
    const sectionCounts = await prisma.$queryRaw`
      SELECT "taxSection"::text, COUNT(*) 
      FROM case_laws
      WHERE "taxSection" IS NOT NULL
      GROUP BY "taxSection"
      ORDER BY COUNT(*) DESC
    `;
    
    console.table(sectionCounts);
    
  } catch (error) {
    console.error('Error checking tax sections:', error);
  }
  
  // 2. Check specifically for Section 17 GST cases
  console.log('\n2. Checking for SECTION_17_GST cases:');
  try {
    const section17Count = await prisma.caseLaw.count({
      where: {
        taxSection: 'SECTION_17_GST'
      }
    });
    
    console.log(`Found ${section17Count} cases with taxSection = SECTION_17_GST`);
    
    if (section17Count > 0) {
      const samples = await prisma.caseLaw.findMany({
        where: {
          taxSection: 'SECTION_17_GST'
        },
        select: {
          id: true,
          tid: true,
          title: true,
          taxSection: true
        },
        take: 3
      });
      
      console.log('Sample cases:');
      samples.forEach((sample, i) => {
        console.log(`${i + 1}. ID: ${sample.id}, TID: ${sample.tid}`);
        console.log(`   Title: ${sample.title?.substring(0, 100)}...`);
        console.log(`   TaxSection: ${sample.taxSection}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error checking Section 17 GST cases:', error);
  }
  
  // 3. Find potential Section 17 cases that don't have taxSection set
  console.log('\n3. Finding potential Section 17 GST cases without taxSection:');
  try {
    const potentialCases = await prisma.caseLaw.findMany({
      where: {
        OR: [
          { title: { contains: 'section 17', mode: 'insensitive' } },
          { headline: { contains: 'section 17', mode: 'insensitive' } },
          { title: { contains: 'apportionment of credit', mode: 'insensitive' } },
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
      take: 100
    });
    
    console.log(`Found ${potentialCases.length} potential Section 17 GST cases without taxSection set`);
    
    if (potentialCases.length > 0) {
      console.log('Sample potential cases:');
      potentialCases.slice(0, 3).forEach((sample, i) => {
        console.log(`${i + 1}. ID: ${sample.id}, TID: ${sample.tid}`);
        console.log(`   Title: ${sample.title?.substring(0, 100)}...`);
        console.log('---');
      });
      
      // 4. Ask for confirmation to update these cases
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question(`\nDo you want to update these ${potentialCases.length} cases to have taxSection = SECTION_17_GST? (y/n) `, async (answer) => {
        if (answer.toLowerCase() === 'y') {
          try {
            // Use raw SQL for PostgreSQL enum compatibility
            const result = await prisma.$executeRaw`
              UPDATE case_laws
              SET "taxSection" = 'SECTION_17_GST'::tax_section
              WHERE id IN (${prisma.join(potentialCases.map(c => c.id))})
            `;
            
            console.log(`Updated ${result} cases with taxSection = SECTION_17_GST`);
          } catch (error) {
            console.error('Error updating cases:', error);
          }
        } else {
          console.log('Update canceled');
        }
        
        readline.close();
        await prisma.$disconnect();
      });
    } else {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error finding potential Section 17 cases:', error);
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
