"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { Bell, Trash } from "lucide-react"
import { getUserAlerts, addAlert, removeAlert } from "@/lib/api"
import { getAuth } from "firebase/auth"
import { useAuth } from "@/contexts/AuthContext"

// Mock data for stock indices
const stockIndices = [
  { id: "SPY", name: "S&P 500" },
  { id: "QQQ", name: "NASDAQ" },
  { id: "DIA", name: "Dow Jones" },
  { id: "IWM", name: "Russell 2000" },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [indexId, setIndexId] = useState("SPY")
  const [condition, setCondition] = useState<"above" | "below">("above")
  const [price, setPrice] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {user} = useAuth()

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      debugger
      const auth = getAuth()
      const user = auth.currentUser
      const data = await getUserAlerts(user?.uid || "")
      setAlerts(data)
    } catch (err) {
      setError("Failed to fetch alerts")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async () => {

    if (!price) return

    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error("User not authenticated")

      const newAlert = {
        symbol: indexId,
        threshold: Number.parseFloat(price),
        type: condition,
        email: user.email || "",
      }

      await addAlert(user?.uid,newAlert)
      await fetchAlerts() // Refresh the alerts list
      setPrice("")
    } catch (err) {
      setError("Failed to create alert")
      console.error(err)
    }
  }

  const handleDeleteAlert = async (symbol: string) => {
    try {
      await removeAlert(user?.uid || "",symbol)
      await fetchAlerts() // Refresh the alerts list
    } catch (err) {
      setError("Failed to delete alert")
      console.error(err)
    }
  }



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Price Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set up alerts for when stock indices reach specific price thresholds
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Create Alert Form */}
        <div className="overflow-hidden rounded-lg bg-white shadow lg:col-span-1">
          <div className="p-6">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-purple-600" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">Create New Alert</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">Get notified when the price reaches a specific threshold</p>

            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="index" className="block text-sm font-medium text-gray-700">
                  Stock Index
                </label>
                <select
                  id="index"
                  value={indexId}
                  onChange={(e) => setIndexId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 text-[#000000] shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                >
                  {stockIndices.map((index) => (
                    <option key={index.id} value={index.id}>
                      {index.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as "above" | "below")}
                  className="mt-1 block w-full rounded-md border-gray-300 text-[#000000] shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price Threshold
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-[#000000] focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="active"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleCreateAlert()}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="overflow-hidden rounded-lg bg-white shadow lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Your Alerts</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your price alerts for stock indices</p>

            <div className="mt-6">
              {loading ? (
                <div className="rounded-md bg-gray-50 py-10 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="rounded-md bg-gray-50 py-10 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts set</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first alert to get notified when a stock index reaches a specific price
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Stock Index
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Condition
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Price Threshold
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {alerts.map((alert) => (
                        <tr key={alert.symbol}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {stockIndices.find(index => index.id === alert.symbol)?.name || alert.symbol}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500 capitalize">{alert.type}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500">${alert.threshold.toLocaleString()}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={alert.active}
                                onChange={() => handleToggleAlertStatus(alert.symbol, !alert.active)}
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-sm text-gray-500">{alert.active ? "Active" : "Inactive"}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteAlert(alert.symbol)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {alerts.length > 0 && (
              <div className="mt-4 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  You will receive email notifications when your active alerts are triggered.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
