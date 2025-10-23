'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from './Input'
import { Button } from './Button'
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'

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
        console.log('Loaded homebase from DB:', data.homebase)
        setHomebase(data.homebase)
        onPortChange(data.homebase)
      }
    } catch (error) {
      console.error('Error loading homebase:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveHomebase = async () => {
    if (!homebase.trim()) return
    
    console.log('handleSaveHomebase called with:', homebase.trim())
    console.log('Saving homebase:', homebase.trim())
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('home_ports')
        .upsert({
          user_id: userId,
          homebase: homebase.trim()
        })

      if (error) throw error

      console.log('Successfully saved homebase:', homebase.trim())
      onPortChange(homebase.trim())
    } catch (error) {
      console.error('Error saving homebase:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangeHomebase = () => {
    setHomebase('')
    onPortChange(null)
  }

  const handleRemoveHomebase = async () => {
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Homebase Port
        </label>
        <div className="animate-pulse bg-dark-700 h-10 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Homebase Port
      </label>
      
      {homebase ? (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm">
              <span>{homebase}</span>
              <button
                onClick={handleRemoveHomebase}
                className="hover:bg-green-700 rounded-full p-0.5 transition-colors duration-200"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleChangeHomebase()
              }}
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={homebase}
              onChange={(e) => {
                console.log('Input changed:', e.target.value)
                setHomebase(e.target.value)
              }}
              onKeyDown={(e) => {
                // Only save on Enter key, prevent any other form submission
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSaveHomebase()
                }
              }}
              placeholder="Enter your homebase port..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSaveHomebase()
              }}
              disabled={!homebase.trim() || isSaving}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}