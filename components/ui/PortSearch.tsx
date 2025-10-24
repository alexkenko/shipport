'use client'

import { useState } from 'react'
import { Input } from './Input'
import { Button } from './Button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PortSearchProps {
  selectedPorts: string[]
  onPortsChange: (ports: string[]) => void
  placeholder?: string
}

export function PortSearch({ selectedPorts, onPortsChange, placeholder = "Search for ports..." }: PortSearchProps) {
  const [newPort, setNewPort] = useState('')

  const handleAddPort = () => {
    if (newPort.trim() && !selectedPorts.includes(newPort.trim())) {
      onPortsChange([...selectedPorts, newPort.trim()])
      setNewPort('')
    }
  }

  const handleRemovePort = (portToRemove: string) => {
    onPortsChange(selectedPorts.filter(port => port !== portToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddPort()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newPort}
          onChange={(e) => setNewPort(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          onClick={handleAddPort}
          disabled={!newPort.trim()}
          variant="outline"
          size="sm"
        >
          Add
        </Button>
      </div>

      {selectedPorts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Selected Ports
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedPorts.map((port, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-green-600 text-white pl-2 pr-1 py-0.5 rounded-full text-sm font-medium"
              >
                <span>{port}</span>
                <button
                  onClick={() => handleRemovePort(port)}
                  className="hover:bg-green-700 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}