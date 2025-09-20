#!/usr/bin/env node

/**
 * Storage Bucket Setup Script for ShipPort
 * This script creates the profile-photos storage bucket
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createStorageBucket() {
  console.log('🚀 Creating profile-photos storage bucket...\n')

  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message)
      process.exit(1)
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'profile-photos')
    
    if (bucketExists) {
      console.log('✅ Bucket "profile-photos" already exists')
      return
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('profile-photos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB limit
    })

    if (error) {
      console.error('❌ Failed to create bucket:', error.message)
      process.exit(1)
    }

    console.log('✅ Storage bucket "profile-photos" created successfully!')
    console.log('📋 Bucket settings:')
    console.log('   - Public: true')
    console.log('   - Allowed file types: JPEG, PNG, GIF, WebP')
    console.log('   - Max file size: 5MB')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Check if we're running this script directly
if (require.main === module) {
  createStorageBucket()
}

module.exports = { createStorageBucket }
