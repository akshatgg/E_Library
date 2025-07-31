import { NextRequest, NextResponse } from 'next/server';
import { runManualSync, getSyncStatus } from '@/lib/cron-jobs/kanoon-sync';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add basic authentication
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CRON_SECRET;
    
    if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔧 Manual sync triggered via API');
    const result = await runManualSync();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sync completed successfully',
      summary: result
    });
  } catch (error: any) {
    console.error('❌ Manual sync failed:', error);
    return NextResponse.json({ 
      error: 'Sync failed', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = await getSyncStatus();
    
    return NextResponse.json({
      success: true,
      status: status
    });
  } catch (error: any) {
    console.error('❌ Failed to get sync status:', error);
    return NextResponse.json({ 
      error: 'Failed to get status', 
      details: error.message 
    }, { status: 500 });
  }
}
