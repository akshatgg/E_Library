#!/usr/bin/env node

// Test script for Kanoon sync cron job
import { runManualSync, getSyncStatus } from '../lib/cron-jobs/kanoon-sync';

async function testSync() {
  console.log('🧪 Testing Kanoon sync...');
  
  try {
    // Get initial status
    console.log('\n📊 Initial status:');
    const initialStatus = await getSyncStatus();
    console.log(initialStatus);
    
    // Run manual sync
    console.log('\n🔄 Running manual sync...');
    const result = await runManualSync();
    console.log('\n✅ Sync completed with result:', result);
    
    // Get final status
    console.log('\n📊 Final status:');
    const finalStatus = await getSyncStatus();
    console.log(finalStatus);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  process.exit(0);
}

testSync();
