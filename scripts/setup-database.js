#!/usr/bin/env node

/**
 * Database Setup Script for ShipPort
 * This script helps set up the initial database structure and sample data
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
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

async function runMigrations() {
  console.log('🚀 Setting up ShipPort database...\n')

  try {
    // Read and execute the SQL migration file
    const migrationPath = path.join(__dirname, '../sql/01_create_tables.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📋 Creating database tables...')
    const { error: migrationError } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (migrationError) {
      console.error('❌ Migration failed:', migrationError.message)
      process.exit(1)
    }
    
    console.log('✅ Database tables created successfully')

    // Insert sample ports
    console.log('\n🌍 Inserting sample ports...')
    const portsPath = path.join(__dirname, '../sql/02_insert_sample_ports.sql')
    const portsSQL = fs.readFileSync(portsPath, 'utf8')
    
    const { error: portsError } = await supabase.rpc('exec_sql', { sql: portsSQL })
    
    if (portsError) {
      console.error('❌ Ports insertion failed:', portsError.message)
      process.exit(1)
    }
    
    console.log('✅ Sample ports inserted successfully')

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Enable authentication in your Supabase dashboard')
    console.log('2. Set up email templates if needed')
    console.log('3. Create a storage bucket for profile photos (optional)')
    console.log('4. Deploy your application to production')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Check if we're running this script directly
if (require.main === module) {
  runMigrations()
}

module.exports = { runMigrations }
