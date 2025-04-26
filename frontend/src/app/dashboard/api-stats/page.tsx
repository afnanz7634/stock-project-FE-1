"use client"

import { useState } from "react"
import { ArrowRight, BarChart3, Clock, Database, RefreshCw, TrendingUp, Zap } from "lucide-react"

// Mock data for API statistics
const mockApiStats = {
  totalCalls: 3427,
  remainingCalls: 6573,
  planLimit: 10000,
  usagePercentage: 34.27,
  resetDate: "May 26, 2025",
  daysUntilReset: 30,
  planName: "Basic",
}

// Mock data for API calls by endpoint
const mockEndpointStats = [
  { endpoint: "Stock Quotes", calls: 1842, color: "bg-purple-500" },
  { endpoint: "Index Data", calls: 986, color: "bg-blue-500" },
  { endpoint: "Historical Prices", calls: 423, color: "bg-green-500" },
  { endpoint: "Company Profiles", calls: 176, color: "bg-yellow-500" },
]

// Mock data for API calls over time
const mockTimeStats = [
  { date: "Apr 19", calls: 120 },
  { date: "Apr 20", calls: 145 },
  { date: "Apr 21", calls: 132 },
  { date: "Apr 22", calls: 167 },
  { date: "Apr 23", calls: 178 },
  { date: "Apr 24", calls: 156 },
  { date: "Apr 25", calls: 198 },
  { date: "Apr 26", calls: 187 },
]

// Mock data for recent API calls
const mockRecentCalls = [
  {
    id: "1",
    endpoint: "/quote",
    parameters: "symbol=AAPL",
    timestamp: "2025-04-26T14:32:45Z",
    status: "success",
  },
  {
    id: "2",
    endpoint: "/indices",
    parameters: "symbol=SPX",
    timestamp: "2025-04-26T14:30:12Z",
    status: "success",
  },
  {
    id: "3",
    endpoint: "/historical",
    parameters: "symbol=MSFT&resolution=D&from=1619395200&to=1619481600",
    timestamp: "2025-04-26T14:28:37Z",
    status: "success",
  },
  {
    id: "4",
    endpoint: "/quote",
    parameters: "symbol=GOOG",
    timestamp: "2025-04-26T14:25:19Z",
    status: "success",
  },
  {
    id: "5",
    endpoint: "/quote",
    parameters: "symbol=INVALID",
    timestamp: "2025-04-26T14:22:05Z",
    status: "error",
  },
]

// Mock data for plan comparison
const planOptions = [
  {
    name: "Basic",
    price: "$0",
    callLimit: "10,000",
    features: ["Stock Quotes", "Index Data", "Basic Historical Data", "5 requests per minute"],
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    callLimit: "50,000",
    features: ["Everything in Basic", "Extended Historical Data", "Company Profiles", "15 requests per minute"],
    current: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    callLimit: "200,000",
    features: [
      "Everything in Pro",
      "Real-time Data",
      "Advanced Analytics",
      "60 requests per minute",
      "Dedicated Support",
    ],
    current: false,
  },
]

export default function ApiStatsPage() {
  const [timeRange, setTimeRange] = useState("week")

  // In a real implementation, you would fetch this data from your API provider
  // This would typically be done in a useEffect hook or using SWR/React Query

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Usage Statistics</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor your API usage and plan limits</p>
      </div>

     

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">API Name : Polygon.io</h2>
        <p className="mt-1 text-sm text-gray-500">Current plan: Free </p>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planOptions.map((plan) => (
            <div
              key={plan.name}
              className={`overflow-hidden rounded-lg ${
                plan.current ? "border-2 border-purple-500" : "border border-gray-200"
              } bg-white shadow`}
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-sm font-medium text-gray-500">/month</span>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{plan.callLimit}</span> API calls per month
                </p>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                {plan.current ? (
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  )
}
