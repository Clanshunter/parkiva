'use client';

import Link from "next/link";
import { useStats } from '@/hooks/useApi';

export default function Home() {
  const { stats, loading } = useStats();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md sm:max-w-lg lg:max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">🅿️ Welcome to Parkiva</h1>
            <p className="py-4 sm:py-6 text-base sm:text-lg">
              Your smart parking solution for Istanbul. Find, manage, and sync parking data with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/parking" className="btn btn-primary btn-sm sm:btn-md">
                Find Parking
              </Link>
              <Link href="/sync" className="btn btn-outline btn-sm sm:btn-md">
                Sync Data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 bg-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-6 sm:px-10 pt-6 sm:pt-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </figure>
              <div className="card-body items-center text-center px-4 sm:px-6">
                <h3 className="card-title text-lg sm:text-xl">Smart Parking Search</h3>
                <p className="text-sm sm:text-base">Search for available parking spaces by district and get real-time information.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-6 sm:px-10 pt-6 sm:pt-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </figure>
              <div className="card-body items-center text-center px-4 sm:px-6">
                <h3 className="card-title text-lg sm:text-xl">Data Synchronization</h3>
                <p className="text-sm sm:text-base">Keep your parking data up-to-date with automatic syncing from ISpark and other sources.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-6 sm:px-10 pt-6 sm:pt-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </figure>
              <div className="card-body items-center text-center px-4 sm:px-6">
                <h3 className="card-title text-lg sm:text-xl">Real-time Analytics</h3>
                <p className="text-sm sm:text-base">Get insights and analytics about parking availability and usage patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="stats shadow w-full flex-col sm:flex-row">
            <div className="stat place-items-center">
              <div className="stat-title text-xs sm:text-sm">Parking Spaces</div>
              <div className="stat-value text-xl sm:text-2xl lg:text-3xl">
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  stats.totalParkingSpaces.toLocaleString()
                )}
              </div>
              <div className="stat-desc text-xs sm:text-sm">Across Istanbul</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title text-xs sm:text-sm">Districts Covered</div>
              <div className="stat-value text-xl sm:text-2xl lg:text-3xl text-secondary">
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  stats.districtsCovered
                )}
              </div>
              <div className="stat-desc text-xs sm:text-sm">All major areas</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title text-xs sm:text-sm">Active Users</div>
              <div className="stat-value text-xl sm:text-2xl lg:text-3xl">
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  `${stats.activeUsers.toLocaleString()}+`
                )}
              </div>
              <div className="stat-desc text-xs sm:text-sm">Growing daily</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
