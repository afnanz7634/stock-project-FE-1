"use client"

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Bell, TrendingUp } from 'lucide-react';
import { getStockQuote } from '@/lib/api';
import Link from "next/link"
import StockChartComponent from "../../components/StockChartComponent"

interface StockIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isUp: boolean;
}

const indexSymbols = {
  sp500: 'SPY',
  // nasdaq: 'QQQ',
  // dowjones: 'DIA',
  // russell2000: 'IWM'
};

export default function DashboardPage() {
  const [selectedIndex, setSelectedIndex] = useState<string>('sp500');
  const [stockIndices, setStockIndices] = useState<StockIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchIndicesData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all indices data in parallel
        const indicesData = await Promise.all(
          Object.entries(indexSymbols).map(async ([id, symbol]) => {
            const quote = await getStockQuote(symbol);
            return {
              id,
              name: getIndexName(id),
              value: quote.c,
              change: quote.c - quote.pc,
              changePercent: ((quote.c - quote.pc) / quote.pc) * 100,
              isUp: quote.c > quote.pc
            };
          })
        );
        console.log(indicesData)
        setStockIndices(indicesData);
      } catch (err) {
        setError('Failed to fetch stock indices data');
        console.error('Error fetching stock indices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndicesData();
  }, []);

  const getIndexName = (id: string) => {
    switch (id) {
      case 'sp500':
        return 'S&P 500';
      // case 'nasdaq':
      //   return 'NASDAQ';
      // case 'dowjones':
      //   return 'Dow Jones';
      // case 'russell2000':
      //   return 'Russell 2000';
      default:
        return '';
    }
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-24 rounded-lg bg-white p-5">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="mt-4 h-8 w-32 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor stock indices and set price alerts</p>
      </div>

      {/* Stock Indices Overview */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Stock Indices</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stockIndices.map((item) => (
            <div
              key={item.id}
              className={`cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md ${
                selectedIndex === item.id ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setSelectedIndex(item.id)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <div className="rounded-full bg-purple-100 p-1">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className={`flex items-center text-sm ${item.isUp ? "text-green-600" : "text-red-600"}`}>
                      {item.isUp ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
                      {item.change?.toFixed(2)} ({item.changePercent?.toFixed(2)}%)
                    </span>
                    <span className="ml-2 text-xs text-gray-500">Today</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              AAPL - Price History
            </h2>
            <div className="flex space-x-2">
              <button className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200">
                1D
              </button>
            </div>
          </div>

          <div className="mt-4 w-full">
            <div className=" w-full ">
              <div className="text-center">
                <StockChartComponent />
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  )
}

