const { PrismaClient } = require('@prisma/client');
const { fetchIndianKanoonData, fetchCaseByTid } = require('./lib/kanoon-api.ts');

const prisma = new PrismaClient();

async function debugSync() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    const testConnection = await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test API call
    console.log('🔍 Testing API call...');
    const cases = await fetchIndianKanoonData({ pagenum: 1 });
    console.log(`📊 Fetched ${cases.length} cases from API`);
    
    if (cases.length > 0) {
      console.log('📄 Sample case data:', {
        tid: cases[0].tid,
        title: cases[0].title?.substring(0, 100) + '...',
        docsource: cases[0].docsource,
        docsize: cases[0].docsize
      });
      
      // Test single case insertion
      console.log('🔍 Testing single case insertion...');
      const sampleCase = cases[0];
      
      // Check if case exists
      const existing = await prisma.caseLaw.findUnique({
        where: { tid: sampleCase.tid }
      });
      
      if (existing) {
        console.log('⚠️  Case already exists:', existing.tid);
      } else {
        console.log('🆕 Creating new case...');
        
        const newCase = await prisma.caseLaw.create({
          data: {
            tid: sampleCase.tid,
            authorid: null,
            bench: null,
            catids: null,
            docsize: sampleCase.docsize,
            docsource: sampleCase.docsource,
            doctype: null,
            fragment: true,
            headline: sampleCase.headline,
            numcitedby: sampleCase.numcitedby,
            numcites: 0,
            publishdate: sampleCase.publishdate,
            title: sampleCase.title,
            category: 'ITAT', // Test with fixed category
          }
        });
        
        console.log('✅ Successfully created case:', newCase.tid);
      }
      
      // Test detail API
      console.log('🔍 Testing detail API...');
      try {
        const detail = await fetchCaseByTid(sampleCase.tid);
        console.log('📄 Detail API response keys:', Object.keys(detail || {}));
        
        if (detail) {
          // Test detail insertion
          const existingDetail = await prisma.caseDetail.findUnique({
            where: { tid: sampleCase.tid }
          });
          
          if (!existingDetail) {
            console.log('🆕 Creating case detail...');
            
            const newDetail = await prisma.caseDetail.create({
              data: {
                tid: sampleCase.tid,
                agreement: detail.agreement || false,
                citetid: detail.citetid || null,
                courtcopy: detail.courtcopy || false,
                divtype: detail.divtype || null,
                doc: detail.doc || '',
                docsource: detail.docsource || sampleCase.docsource,
                numcitedby: detail.numcitedby || 0,
                numcites: detail.numcites || 0,
                publishdate: detail.publishdate || sampleCase.publishdate,
                queryAlert: detail.query_alert || null,
                title: detail.title || sampleCase.title,
              }
            });
            
            console.log('✅ Successfully created case detail:', newDetail.tid);
          } else {
            console.log('⚠️  Case detail already exists:', existingDetail.tid);
          }
        }
      } catch (detailError) {
        console.error('❌ Detail API error:', detailError);
      }
    }
    
    // Check final database state
    const totalCases = await prisma.caseLaw.count();
    const totalDetails = await prisma.caseDetail.count();
    
    console.log('📊 Final database state:');
    console.log(`   Total cases: ${totalCases}`);
    console.log(`   Total details: ${totalDetails}`);
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  } finally {
    await prisma.$disconnect();
  }
}

debugSync();
