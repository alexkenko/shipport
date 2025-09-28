import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  console.log('🚀 Admin superintendents API called')
  try {
    // Check authentication using Supabase directly
    const authHeader = request.headers.get('authorization')
    console.log('🔐 Auth header received:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader) {
      console.log('❌ No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔑 Token extracted:', token ? 'Present' : 'Missing')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('👤 Admin API - User auth result:', { user: user?.email, error: authError?.message })
    console.log('📧 Admin API - Email comparison:', { 
      userEmail: user?.email, 
      expectedEmail: 'kenkadzealex@gmail.com',
      matches: user?.email === 'kenkadzealex@gmail.com'
    })
    
    if (authError || !user || user.email !== 'kenkadzealex@gmail.com') {
      console.log('🚫 Admin API - Authorization failed:', { 
        authError: authError?.message, 
        userEmail: user?.email,
        hasUser: !!user,
        emailMatch: user?.email === 'kenkadzealex@gmail.com'
      })
      return NextResponse.json({ error: 'Unauthorized. Only admin users can access this endpoint.' }, { status: 401 })
    }

    // Get search parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    console.log('📊 Query params:', { search, page, limit })

    // Build query for superintendents with verification data
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        surname,
        phone,
        company,
        bio,
        photo_url,
        website,
        linkedin,
        twitter,
        facebook,
        created_at,
        role,
        email_verifications(
          is_verified,
          verified_at
        )
      `)
      .eq('role', 'superintendent')

    // Add search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,surname.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    console.log('🔢 Pagination:', { from, to, limit })

    // Get count separately for pagination
    let countQuery = supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'superintendent')
    
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,surname.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }
    
    console.log('📊 Getting count...')
    const { count, error: countError } = await countQuery
    console.log('📊 Count result:', { count, countError: countError?.message })

    console.log('🔍 Getting superintendents...')
    const { data: superintendents, error } = await query
      .range(from, to)

    console.log('🔍 Superintendents result:', { 
      count: superintendents?.length, 
      error: error?.message,
      firstSuperintendent: superintendents?.[0]?.email 
    })

    if (error) {
      console.error('❌ Error fetching superintendents:', error)
      return NextResponse.json({ error: 'Failed to fetch superintendents' }, { status: 500 })
    }

    return NextResponse.json({
      superintendents: superintendents || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in superintendents API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
