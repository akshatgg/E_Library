import { startKanoonSyncCron } from './kanoon-sync';

export function initializeCronJobs() {
  // Only run cron jobs in production or when explicitly enabled
  console.log('🔧 Initializing cron jobs...');
  console.log('Current environment:', process.env.NODE_ENV);
  console.log('Cron jobs enabled:', process.env.ENABLE_CRON_JOBS);
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON_JOBS === 'true') {
    console.log('🔧 Initializing cron jobs...');
    startKanoonSyncCron();
    console.log('✅ All cron jobs initialized');
  } else {
    console.log('⚠️ Cron jobs disabled. Set ENABLE_CRON_JOBS=true to enable in development');
  }
}

// Auto-initialize when module is imported
if (typeof window === 'undefined') { // Only run on server-side
  initializeCronJobs();
}
