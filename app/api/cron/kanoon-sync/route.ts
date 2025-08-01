import { NextRequest, NextResponse } from 'next/server';
import { runManualSync, getSyncStatus, getAllCategoriesStatus } from '@/lib/cron-jobs/kanoon-sync';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add basic authentication
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CRON_SECRET;
    
    if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get category from query parameters or request body
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    console.log('🔧 Manual sync triggered via API');
    if (category) {
      console.log(`🎯 Targeting category: ${category}`);
    }
    
    const result = await runManualSync(category || undefined);
    
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const showAll = searchParams.get('all') === 'true';

    let status;
    if (showAll) {
      status = await getAllCategoriesStatus();
    } else {
      status = await getSyncStatus(category || undefined);
    }
    
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
