'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface MobileDatePickerProps {
  selected?: Date
  onChange: (date: Date | null) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  className?: string
  disabled?: boolean
}

export function MobileDatePicker({
  selected,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  className = '',
  disabled = false
}: MobileDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDate, setTempDate] = useState<Date | null>(selected || null)

  useEffect(() => {
    setTempDate(selected || null)
  }, [selected])

  const handleConfirm = () => {
    onChange(tempDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempDate(selected || null)
    setIsOpen(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Generate years array
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

  // Generate months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Generate days array for selected month/year
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const isDateDisabled = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day)
    
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true
    
    return false
  }

  const currentDate = tempDate || new Date()
  const currentYearValue = currentDate.getFullYear()
  const currentMonthValue = currentDate.getMonth()
  const currentDayValue = currentDate.getDate()

  return (
    <div className={`relative ${className}`}>
      {/* Input Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selected ? 'text-white' : 'text-gray-400'}>
          {selected ? formatDate(selected) : placeholder}
        </span>
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </button>

      {/* Mobile Date Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-dark-800 rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-white">Select Date</h3>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Date Picker Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Year Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Year</label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setTempDate(new Date(year, currentMonthValue, currentDayValue))}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        currentYearValue === year
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Month</label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => setTempDate(new Date(currentYearValue, index, currentDayValue))}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        currentMonthValue === index
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Day</label>
                <div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto">
                  {Array.from({ length: getDaysInMonth(currentYearValue, currentMonthValue) }, (_, i) => {
                    const day = i + 1
                    const isDisabled = isDateDisabled(currentYearValue, currentMonthValue, day)
                    const isSelected = currentDayValue === day

                    return (
                      <button
                        key={day}
                        onClick={() => !isDisabled && setTempDate(new Date(currentYearValue, currentMonthValue, day))}
                        disabled={isDisabled}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : isDisabled
                            ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 border-t border-dark-700">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
