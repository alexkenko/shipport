'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  width?: string
  sticky?: boolean
}

interface MobileTableProps {
  columns: Column[]
  data: any[]
  className?: string
  emptyMessage?: string
  loading?: boolean
}

export function MobileTable({ 
  columns, 
  data, 
  className = '', 
  emptyMessage = 'No data available',
  loading = false 
}: MobileTableProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && tableRef.current) {
      tableRef.current.scrollLeft += 200
    }
    if (isRightSwipe && tableRef.current) {
      tableRef.current.scrollLeft -= 200
    }
  }

  const scrollTable = (direction: 'left' | 'right') => {
    if (tableRef.current) {
      const scrollAmount = 200
      const newPosition = direction === 'left' 
        ? tableRef.current.scrollLeft - scrollAmount
        : tableRef.current.scrollLeft + scrollAmount
      
      tableRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setScrollPosition(newPosition)
    }
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = tableRef.current 
    ? scrollPosition < (tableRef.current.scrollWidth - tableRef.current.clientWidth)
    : false

  if (loading) {
    return (
      <div className={`bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 ${className}`}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={`bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 text-center ${className}`}>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 ${className}`}>
      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-left py-3 px-4 text-sm font-medium text-gray-300 ${column.sticky ? 'sticky left-0 bg-dark-800 z-10' : ''}`}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`py-3 px-4 text-sm text-gray-300 ${column.sticky ? 'sticky left-0 bg-dark-800 z-10' : ''}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Horizontal Scrollable Table */}
      <div className="lg:hidden">
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scrollTable('left')}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-dark-700 text-white transition-all ${
              canScrollLeft ? 'hover:bg-dark-600' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTable('right')}
            disabled={!canScrollRight}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-dark-700 text-white transition-all ${
              canScrollRight ? 'hover:bg-dark-600' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          {/* Scrollable Table */}
          <div
            ref={tableRef}
            className="overflow-x-auto touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="inline-block min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`text-left py-3 px-4 text-sm font-medium text-gray-300 whitespace-nowrap ${column.sticky ? 'sticky left-0 bg-dark-800 z-10' : ''}`}
                        style={{ width: column.width || '200px' }}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`py-3 px-4 text-sm text-gray-300 whitespace-nowrap ${column.sticky ? 'sticky left-0 bg-dark-800 z-10' : ''}`}
                        >
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              {canScrollLeft && (
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              )}
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              {canScrollRight && (
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View (Alternative for very small screens) */}
      <div className="block lg:hidden xl:hidden">
        <div className="space-y-4 mt-4">
          {data.map((row, index) => (
            <Card key={index} variant="elevated">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.key} className="flex justify-between items-start">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {column.label}
                      </span>
                      <span className="text-sm text-gray-300 text-right ml-2">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
