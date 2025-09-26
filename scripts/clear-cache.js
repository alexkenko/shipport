#!/usr/bin/env node

/**
 * Cache clearing utility for development
 * This helps clear browser cache and force fresh data loading
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Cache Clearing Utility');
console.log('========================');

// Clear Next.js cache
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('📁 Clearing Next.js cache...');
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('✅ Next.js cache cleared');
} else {
  console.log('ℹ️  No Next.js cache found');
}

// Clear node_modules/.cache if it exists
const nodeModulesCache = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(nodeModulesCache)) {
  console.log('📁 Clearing node_modules cache...');
  fs.rmSync(nodeModulesCache, { recursive: true, force: true });
  console.log('✅ Node modules cache cleared');
}

console.log('\n🚀 Cache clearing complete!');
console.log('💡 Tips:');
console.log('   - Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)');
console.log('   - Clear browser cache if issues persist');
console.log('   - Check browser dev tools Network tab for cache headers');
console.log('\n📝 New caching strategy:');
console.log('   - Blog pages: 60 seconds');
console.log('   - Blog API: 30 seconds');
console.log('   - Other API: 5 minutes');
