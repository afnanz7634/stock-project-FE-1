"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, ChevronDown, Home, LineChart, LogOut, Menu, X, BarChart3 } from "lucide-react"
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Stock Indices",
      path: "/dashboard/indices",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      name: "Alerts",
      path: "/dashboard/alerts",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "API Stats",
      path: "/dashboard/api-stats",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
        <Header />

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`${
                      pathname === route.path
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <div className="mr-3 flex-shrink-0">{route.icon}</div>
                    {route.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
