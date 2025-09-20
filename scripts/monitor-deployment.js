#!/usr/bin/env node

/**
 * ShipPort Deployment Monitoring Script
 * This script monitors your Supabase database and deployment health
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabaseHealth() {
  console.log('🔍 Checking database health...')
  
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    console.log('✅ Database connection: OK')
    
    // Check table counts
    const tables = ['users', 'jobs', 'job_applications', 'notifications', 'ports']
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      
      console.log(`📊 ${table}: ${count || 0} records`)
    }
    
    return true
  } catch (error) {
    console.error('❌ Database health check failed:', error.message)
    return false
  }
}

async function checkRecentActivity() {
  console.log('\n📈 Checking recent activity...')
  
  try {
    // Check recent users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (usersError) throw usersError
    
    console.log(`👥 Recent users: ${users.length}`)
    users.forEach(user => {
      console.log(`   - ${user.name} ${user.surname} (${user.role})`)
    })
    
    // Check recent jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (jobsError) throw jobsError
    
    console.log(`\n💼 Recent jobs: ${jobs.length}`)
    jobs.forEach(job => {
      console.log(`   - ${job.title} at ${job.port_name}`)
    })
    
    // Check recent applications
    const { data: applications, error: appsError } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (appsError) throw appsError
    
    console.log(`\n📝 Recent applications: ${applications.length}`)
    
    return true
  } catch (error) {
    console.error('❌ Activity check failed:', error.message)
    return false
  }
}

async function generateHealthReport() {
  console.log('🚢 ShipPort Deployment Health Report')
  console.log('=====================================\n')
  
  const dbHealth = await checkDatabaseHealth()
  const activityHealth = await checkRecentActivity()
  
  console.log('\n📋 Summary:')
  console.log(`Database Health: ${dbHealth ? '✅ OK' : '❌ FAILED'}`)
  console.log(`Activity Check: ${activityHealth ? '✅ OK' : '❌ FAILED'}`)
  
  if (dbHealth && activityHealth) {
    console.log('\n🎉 All systems operational!')
    console.log('Your ShipPort application is running smoothly.')
  } else {
    console.log('\n⚠️  Issues detected. Please check the logs above.')
  }
  
  console.log('\n💡 Monitoring Tips:')
  console.log('- Run this script daily: npm run monitor')
  console.log('- Check Vercel dashboard for deployment status')
  console.log('- Monitor Supabase dashboard for database metrics')
  console.log('- Set up alerts for critical errors')
}

// Run the health check
if (require.main === module) {
  generateHealthReport()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Health check failed:', error)
      process.exit(1)
    })
}

module.exports = { generateHealthReport }
