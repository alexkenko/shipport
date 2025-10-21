'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPinIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface Port {
  id: string
  main_port_name: string
  alternate_port_name?: string
  country_code?: string
  region_name?: string
  latitude?: number
  longitude?: number
  harbor_size?: string
  harbor_type?: string
}

interface PortSearchProps {
  selectedPorts: string[]
  onPortsChange: (ports: string[]) => void
  placeholder?: string
  maxResults?: number
}

export function PortSearch({ 
  selectedPorts, 
  onPortsChange, 
  placeholder = "Search for ports...",
  maxResults = 10 
}: PortSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Port[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  // Search for ports
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const { data, error } = await supabase
          .from('ports')
          .select('id, main_port_name, alternate_port_name, country_code, region_name, latitude, longitude, harbor_size, harbor_type')
          .or(`main_port_name.ilike.%${searchTerm}%,alternate_port_name.ilike.%${searchTerm}%,region_name.ilike.%${searchTerm}%,country_code.ilike.%${searchTerm}%`)
          .order('main_port_name')
          .limit(maxResults)

        if (error) throw error
        setSearchResults(data || [])
        setShowResults(true)
      } catch (error) {
        console.error('Error searching ports:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300) // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm, maxResults])

  // Handle port selection
  const handlePortSelect = (port: Port) => {
    const portName = port.alternate_port_name || port.main_port_name
    if (!selectedPorts.includes(portName)) {
      onPortsChange([...selectedPorts, portName])
    }
    setSearchTerm('')
    setShowResults(false)
    inputRef.current?.focus()
  }

  // Handle port removal
  const handlePortRemove = (portToRemove: string) => {
    onPortsChange(selectedPorts.filter(port => port !== portToRemove))
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true)
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-dark-800 border border-dark-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((port) => (
            <button
              key={port.id}
              onClick={() => handlePortSelect(port)}
              className="w-full px-4 py-3 text-left hover:bg-dark-700 transition-colors duration-200 border-b border-dark-600 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {port.alternate_port_name || port.main_port_name}
                  </div>
                  <div className="text-sm text-gray-400 truncate">
                    {port.region_name && `${port.region_name}, `}
                    {port.country_code}
                    {port.harbor_size && ` • ${port.harbor_size}`}
                    {port.harbor_type && ` • ${port.harbor_type}`}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Ports */}
      {selectedPorts.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {selectedPorts.map((port, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm"
              >
                <MapPinIcon className="h-4 w-4" />
                <span>{port}</span>
                <button
                  onClick={() => handlePortRemove(port)}
                  className="hover:bg-primary-700 rounded-full p-0.5 transition-colors duration-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
