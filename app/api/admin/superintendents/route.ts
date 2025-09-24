import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check authentication using Supabase directly
    const authHeader = request.headers.get('authorization')
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader) {
      console.log('No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Token extracted:', token ? 'Present' : 'Missing')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('User auth result:', { user: user?.email, error: authError?.message })
    
    if (authError || !user || user.email !== 'kenkadzealex@gmail.com') {
      console.log('Authorization failed:', { authError: authError?.message, userEmail: user?.email })
      return NextResponse.json({ error: 'Unauthorized. Only admin users can access this endpoint.' }, { status: 401 })
    }

    // Get search parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query for superintendents with their profiles
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
        superintendent_profiles (
          id,
          services,
          ports_covered,
          price_per_workday,
          price_per_idle_day,
          certifications,
          vessel_types,
          years_experience,
          availability_status,
          created_at,
          updated_at
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

    const { data: superintendents, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      console.error('Error fetching superintendents:', error)
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
