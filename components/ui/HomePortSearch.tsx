'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from './Input'
import { Button } from './Button'
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface HomePortSearchProps {
  userId: string
  onPortChange: (port: { port_name: string; country: string; latitude: number; longitude: number } | null) => void
}

interface Port {
  id: string
  main_port_name: string
  country_name: string
  latitude: number
  longitude: number
}

export function HomePortSearch({ userId, onPortChange }: HomePortSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Port[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [currentHomePort, setCurrentHomePort] = useState<{ port_name: string; country: string; latitude: number; longitude: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load current home port
  useEffect(() => {
    loadCurrentHomePort()
  }, [userId])

  const loadCurrentHomePort = async () => {
    try {
      const { data, error } = await supabase
        .from('home_ports')
        .select('port_name, country, latitude, longitude')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading home port:', error)
        return
      }

      if (data) {
        setCurrentHomePort(data)
        onPortChange(data)
      }
    } catch (error) {
      console.error('Error loading home port:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search for ports
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        handleSearch()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('ports')
        .select('id, main_port_name, country_name, latitude, longitude')
        .ilike('search_text', `%${searchTerm.toLowerCase()}%`)
        .limit(10)

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Error searching ports:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectPort = async (port: Port) => {
    try {
      // Save to home_ports table
      const { error } = await supabase
        .from('home_ports')
        .upsert({
          user_id: userId,
          port_name: port.main_port_name,
          country: port.country_name,
          latitude: port.latitude,
          longitude: port.longitude
        })

      if (error) throw error

      // Update local state
      const homePort = {
        port_name: port.main_port_name,
        country: port.country_name,
        latitude: port.latitude,
        longitude: port.longitude
      }
      
      setCurrentHomePort(homePort)
      onPortChange(homePort)
      setSearchTerm('')
      setSearchResults([])
    } catch (error) {
      console.error('Error saving home port:', error)
    }
  }

  const handleRemovePort = async () => {
    try {
      const { error } = await supabase
        .from('home_ports')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      setCurrentHomePort(null)
      onPortChange(null)
    } catch (error) {
      console.error('Error removing home port:', error)
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
      
      {currentHomePort ? (
        <div className="flex items-center justify-between p-3 bg-primary-600 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-white" />
            <span className="text-white font-medium">
              {currentHomePort.port_name}, {currentHomePort.country}
            </span>
          </div>
          <button
            onClick={handleRemovePort}
            className="text-white hover:text-red-300 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for your homebase port..."
            icon={isSearching ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
          />

          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((port) => (
                <button
                  key={port.id}
                  type="button"
                  onClick={() => handleSelectPort(port)}
                  className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                >
                  <span>{port.main_port_name}, {port.country_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
