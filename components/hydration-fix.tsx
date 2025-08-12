'use client';

import { useEffect } from 'react';

/**
 * This component handles hydration mismatches that might be caused
 * by browser extensions adding attributes to the body element.
 */
export function HydrationFix() {
  useEffect(() => {
    // This runs only on the client after hydration
    // We can safely handle any browser extension attributes here
    document.body.setAttribute('data-cz-shortcut-listen', 'true');
  }, []);

  return null; // This component doesn't render anything
}
