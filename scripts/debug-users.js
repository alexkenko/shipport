#!/usr/bin/env node

/**
 * Debug script to check users and profiles in the database
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Please create .env.local file with:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugUsers() {
  console.log('🔍 Debugging users and profiles...\n')

  try {
    // Check all users
    console.log('📋 All Users:')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, name, surname, company, created_at')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    if (users && users.length > 0) {
      users.forEach(user => {
        console.log(`  - ${user.name} ${user.surname} (${user.role}) - ${user.email}`)
      })
    } else {
      console.log('  No users found')
    }

    // Check superintendents
    console.log('\n👨‍💼 Superintendents:')
    const { data: superintendents, error: supError } = await supabase
      .from('users')
      .select('id, email, name, surname, company')
      .eq('role', 'superintendent')

    if (supError) {
      console.error('❌ Error fetching superintendents:', supError.message)
      return
    }

    if (superintendents && superintendents.length > 0) {
      superintendents.forEach(sup => {
        console.log(`  - ${sup.name} ${sup.surname} - ${sup.email}`)
      })
    } else {
      console.log('  No superintendents found')
    }

    // Check superintendent profiles
    console.log('\n📝 Superintendent Profiles:')
    const { data: supProfiles, error: profilesError } = await supabase
      .from('superintendent_profiles')
      .select(`
        *,
        users!superintendent_profiles_user_id_fkey (
          name,
          surname,
          email
        )
      `)

    if (profilesError) {
      console.error('❌ Error fetching superintendent profiles:', profilesError.message)
      return
    }

    if (supProfiles && supProfiles.length > 0) {
      supProfiles.forEach(profile => {
        const user = profile.users
        console.log(`  - ${user.name} ${user.surname} (${user.email})`)
        console.log(`    Certifications: ${profile.certifications?.length || 0}`)
        console.log(`    Vessel Types: ${profile.vessel_types?.length || 0}`)
        console.log(`    Services: ${profile.services?.length || 0}`)
        console.log(`    Ports: ${profile.ports_covered?.length || 0}`)
      })
    } else {
      console.log('  No superintendent profiles found')
    }

    // Check managers
    console.log('\n👨‍💻 Managers:')
    const { data: managers, error: mgrError } = await supabase
      .from('users')
      .select('id, email, name, surname, company')
      .eq('role', 'manager')

    if (mgrError) {
      console.error('❌ Error fetching managers:', mgrError.message)
      return
    }

    if (managers && managers.length > 0) {
      managers.forEach(mgr => {
        console.log(`  - ${mgr.name} ${mgr.surname} - ${mgr.email}`)
      })
    } else {
      console.log('  No managers found')
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  }
}

// Run the debug
debugUsers()
