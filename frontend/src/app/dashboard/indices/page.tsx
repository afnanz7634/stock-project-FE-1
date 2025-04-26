"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { getStockIndices } from "@/lib/api"

// Simple LineChart icon component
function LineChartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}

export default function IndicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null)
  const [indices, setIndices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("Fetching indices...");

    const fetchIndices = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getStockIndices(20)
        setIndices(data)
      } catch (err) {
        setError("Failed to fetch stock indices")
        console.error("Error fetching stock indices:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIndices()
  }, [])

  const filteredIndices = indices.filter((index) => index.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedIndexData = selectedIndex ? indices.find((index) => index.id === selectedIndex) : null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Indices</h1>
          <p className="mt-1 text-sm text-gray-500">Loading indices data...</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
          <div className="h-96 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Indices</h1>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Indices</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and monitor global stock indices</p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search indices..."
          className="block w-full rounded-md text-[#000000] border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">All Indices</h2>
              <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Value
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredIndices.map((index) => (
                      <tr
                        key={index.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedIndex === index.id ? "bg-purple-50" : ""
                        }`}
                        onClick={() => setSelectedIndex(index.id)}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{index.name}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="text-sm text-gray-900">
                            {index.value.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center text-sm ${
                              index.isUp ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {index.isUp ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
                            {index.change?.toFixed(2)} ({index.changePercent?.toFixed(2)}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredIndices.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500">
                          No indices found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
