const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBlogStorage() {
  try {
    console.log('Setting up blog images storage bucket...')

    // Create the blog-images bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('blog-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880, // 5MB
    })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Blog images bucket already exists')
      } else {
        throw bucketError
      }
    } else {
      console.log('✅ Blog images bucket created successfully')
    }

    // Set up RLS policies for the bucket
    const policies = [
      {
        name: 'Allow public read access to blog images',
        definition: 'true',
        check: 'true',
        operation: 'SELECT'
      },
      {
        name: 'Allow authenticated users to upload blog images',
        definition: 'auth.role() = \'authenticated\'',
        check: 'auth.role() = \'authenticated\'',
        operation: 'INSERT'
      },
      {
        name: 'Allow authenticated users to update blog images',
        definition: 'auth.role() = \'authenticated\'',
        check: 'auth.role() = \'authenticated\'',
        operation: 'UPDATE'
      },
      {
        name: 'Allow authenticated users to delete blog images',
        definition: 'auth.role() = \'authenticated\'',
        check: 'auth.role() = \'authenticated\'',
        operation: 'DELETE'
      }
    ]

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO storage.policies (bucket_id, name, definition, check_expression, operation)
          VALUES ('blog-images', '${policy.name}', '${policy.definition}', '${policy.check}', '${policy.operation}')
          ON CONFLICT (bucket_id, name) DO NOTHING;
        `
      })

      if (policyError) {
        console.log(`⚠️  Policy ${policy.name} may already exist or there was an error:`, policyError.message)
      } else {
        console.log(`✅ Policy ${policy.name} created successfully`)
      }
    }

    console.log('🎉 Blog storage setup completed!')
  } catch (error) {
    console.error('❌ Error setting up blog storage:', error)
    process.exit(1)
  }
}

setupBlogStorage()
