'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from './Input'
import { Button } from './Button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface HomePortSearchProps {
  userId: string
  onPortChange: (homebase: string | null) => void
}

export function HomePortSearch({ userId, onPortChange }: HomePortSearchProps) {
  const [homebase, setHomebase] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load current homebase
  useEffect(() => {
    loadCurrentHomebase()
  }, [userId])

  const loadCurrentHomebase = async () => {
    try {
      const { data, error } = await supabase
        .from('home_ports')
        .select('homebase')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading homebase:', error)
        return
      }

      if (data) {
        setHomebase(data.homebase)
        onPortChange(data.homebase)
      }
    } catch (error) {
      console.error('Error loading homebase:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveHomebase = async () => {
    if (!homebase.trim()) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('home_ports')
        .upsert({
          user_id: userId,
          homebase: homebase.trim()
        })

      if (error) throw error

      onPortChange(homebase.trim())
    } catch (error) {
      console.error('Error saving homebase:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const removeHomebase = async () => {
    try {
      const { error } = await supabase
        .from('home_ports')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      setHomebase('')
      onPortChange(null)
    } catch (error) {
      console.error('Error removing homebase:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-dark-700 h-10 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {homebase ? (
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm">
              <span>{homebase}</span>
              <button
                onClick={removeHomebase}
                className="hover:bg-green-700 rounded-full p-0.5 transition-colors duration-200"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <Button
              type="button"
              onClick={() => setHomebase('')}
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={homebase}
            onChange={(e) => setHomebase(e.target.value)}
            placeholder="Enter your homebase port..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={saveHomebase}
            disabled={!homebase.trim() || isSaving}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  )
}